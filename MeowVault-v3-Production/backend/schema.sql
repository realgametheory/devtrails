-- MeowVault Phase 2 — PostgreSQL Schema
-- Parametric Income Protection for Gig Delivery Workers

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Riders table
CREATE TABLE riders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone VARCHAR(20) NOT NULL UNIQUE,
    platform VARCHAR(20) NOT NULL CHECK (platform IN ('Swiggy', 'Zomato', 'Both')),
    partner_id VARCHAR(50) NOT NULL,
    zones TEXT[] NOT NULL,
    income_bracket INTEGER NOT NULL CHECK (income_bracket BETWEEN 0 AND 3),
    upi_id VARCHAR(100) NOT NULL,
    loyalty_weeks INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Policies table (weekly coverage)
CREATE TABLE policies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID REFERENCES riders(id),
    policy_number VARCHAR(30) NOT NULL UNIQUE,
    premium_amount DECIMAL(10,2) NOT NULL,
    coverage_cap DECIMAL(10,2) NOT NULL,
    risk_score INTEGER NOT NULL,
    coverage_start TIMESTAMPTZ NOT NULL,
    coverage_end TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Claims table (auto-triggered parametric claims)
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    policy_id UUID REFERENCES policies(id),
    rider_id UUID REFERENCES riders(id),
    trigger_type VARCHAR(30) NOT NULL CHECK (trigger_type IN ('weather', 'aqi', 'geopolitical', 'platform', 'heat', 'bandh')),
    zone VARCHAR(50) NOT NULL,
    payout_amount DECIMAL(10,2) NOT NULL,
    fraud_score INTEGER NOT NULL,
    status VARCHAR(30) DEFAULT 'auto_approved' CHECK (status IN ('auto_approved', 'soft_hold', 'manual_review', 'rejected', 'paid')),
    trigger_data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- Payments table (premium collections + payouts)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID REFERENCES riders(id),
    type VARCHAR(20) NOT NULL CHECK (type IN ('premium', 'payout')),
    amount DECIMAL(10,2) NOT NULL,
    upi_id VARCHAR(100),
    gateway_txn_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'processed', 'failed')),
    gateway VARCHAR(30) DEFAULT 'razorpay',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger events log (audit trail)
CREATE TABLE trigger_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trigger_type VARCHAR(30) NOT NULL,
    zone VARCHAR(50) NOT NULL,
    raw_data JSONB NOT NULL DEFAULT '{}',
    threshold_met BOOLEAN NOT NULL,
    source VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pricing cache (Redis backup for weekly quotes)
CREATE TABLE pricing_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rider_id UUID REFERENCES riders(id),
    week_key VARCHAR(20) NOT NULL,
    premium DECIMAL(10,2) NOT NULL,
    risk_score INTEGER NOT NULL,
    signals JSONB NOT NULL DEFAULT '{}',
    model_version VARCHAR(50),
    computed_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rider_id, week_key)
);

-- Fraud checks log
CREATE TABLE fraud_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    claim_id UUID REFERENCES claims(id),
    rider_id UUID REFERENCES riders(id),
    fraud_score INTEGER NOT NULL,
    decision VARCHAR(30) NOT NULL,
    signal_results JSONB NOT NULL DEFAULT '{}',
    model_version VARCHAR(50),
    checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_riders_phone ON riders(phone);
CREATE INDEX idx_policies_rider ON policies(rider_id);
CREATE INDEX idx_policies_status ON policies(status);
CREATE INDEX idx_claims_rider ON claims(rider_id);
CREATE INDEX idx_claims_status ON claims(status);
CREATE INDEX idx_claims_created ON claims(created_at);
CREATE INDEX idx_payments_rider ON payments(rider_id);
CREATE INDEX idx_trigger_events_type ON trigger_events(trigger_type);
CREATE INDEX idx_pricing_cache_rider_week ON pricing_cache(rider_id, week_key);
