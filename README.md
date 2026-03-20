#  MeowVault — AI-Powered Parametric Income Protection for Gig Delivery Workers

> **Guidewire DEVTrails 2026 | Phase 1 Idea Document**
> **Persona:** Food Delivery Partners (Zomato / Swiggy) — Bengaluru
> **Platform:** Progressive Web App (PWA) — Mobile-first
> **Phase 1 Deadline:** March 20, 2026

---

## Table of Contents

1. The Problem
2. Why Bengaluru, Why Now
3. Persona & Real-World Scenarios
4. Application Workflow
5. AI-Driven Weekly Pricing Engine
6. Parametric Trigger Definitions
7. AI / ML Integration Plan
8. Platform Choice Justification
9. Tech Stack

---

## 1. The Problem

India's food delivery partners are the invisible backbone of urban life. On a good day, a Swiggy or Zomato rider in Bengaluru earns ₹800–₹1,200 in net income. On a bad day, a cloudburst in Koramangala, a restaurant shuttered because it ran out of cooking gas, a union strike, or a heatwave and their earnings fall to zero while their costs (fuel, phone recharge, EMIs) remain fixed.

External disruptions cause gig workers to lose **20–30% of monthly income**. They have no employer, no safety net, and no insurance that covers *income loss from events outside their control*.

**MeowVault** fills that gap. It is a fully AI-driven parametric insurance platform that monitors real-world disruptions, calculates a personalised weekly premium using live data from weather feeds, political news, platform signals, economic indicators and pays out lost wages automatically, without the rider filing a single form.

>  **Coverage scope:** MeowVault covers **income loss only**. It strictly excludes health, life, accident, and vehicle repair coverage.

---

## 2. Why Bengaluru, Why Now

Bengaluru is the sharpest lens through which to study gig worker income risk in 2026. In the past three months alone, food delivery riders in the city have faced three simultaneous, compounding disruptions:

###  The LPG / West Asia War Crisis (March 2026 — Ongoing)
The Israel-Iran conflict and the closure of the Strait of Hormuz disrupted 90% of India's LPG import routes. The Government of India's **LPG Control Order 2026** (issued March 8, 2026) capped commercial LPG supply to just **20% of average monthly requirement**, prioritising households and hospitals.

The result for Bengaluru's food delivery riders was immediate and brutal:
- The **Bangalore Hotels Association** reported that only **10% of restaurants** in the city received their gas supply on March 9–10, 2026.
- Over **100 eateries** from iconic darshinis like Vidyarthi Bhavan to neighbourhood dhabas shut their kitchens.
- With restaurants closed or running with limited menus, **Swiggy and Zomato order volumes in Bengaluru dropped sharply**, leaving riders logged on but with nowhere to pick up from.
- Riders reported waiting 2–3 hours between orders in zones like Indiranagar, HSR Layout, JP Nagar and zones that are normally among the busiest in the country.

A delivery partner's income collapsed, not because of weather, not because of their performance, but because a geopolitical conflict 3,000 km away made restaurant kitchens go dark.

###  Algorithmic Pay Cuts & Shadow Banning (Early 2026)
In early 2026, the **Karnataka App-Based Drivers Union** documented widespread "shadow banning", a practice where the platform's algorithm quietly deprioritises order assignments for riders who have participated in protests or logged complaints, without formal deactivation. Affected riders saw their daily order counts drop from 15–20 to 3–5 with no notification or appeal process.

###  The December 2025 / New Year Strike Disruptions
On **December 25 and December 31, 2025**, over two lakh gig workers across India participated in coordinated strikes led by the Indian Federation of App-Based Transport Workers (IFAT). In Bengaluru, workers protesting unsafe 10-minute delivery mandates and arbitrary ID blocking faced retaliation with the Karnataka Gig Workers Act (2025) triggered but enforcement lagging. During both strike days, riders who did *not* strike still lost income due to zone-wide delivery disruptions and platform traffic drops.

These three events, all in Bengaluru, all within 90 days, form the exact scenario MeowVault is designed to protect against.

---

## 3. Persona & Real-World Scenarios

### Primary Persona — Arjun, Food Delivery Partner, Bengaluru

| Field | Detail |
|---|---|
| Age | 26 |
| Platform | Swiggy (primary), Zomato (secondary) |
| Location | Operates across HSR Layout, Koramangala, BTM Layout |
| Working hours | 10–12 hrs/day, 6 days/week |
| Average earnings | ₹900–₹1,100/day on a good week |
| Device | Android mid-range (Redmi/Realme) |
| Payment | UPI (GPay / PhonePe) |
| Financial reality | No savings buffer; EMI on two-wheeler; family dependant |

Arjun has no employer. He is a "delivery partner," not an employee. The Karnataka Gig Workers Act 2025 offers some protections, but none of them replace income he never earns because a restaurant's kitchen is dark.

---

### Disruption Scenarios (Grounded in Real 2025–26 Events)

####  Scenario 1 — LPG Crisis / Restaurant Kitchen Shutdown (Active: March 2026)
**What happened:** The Israel-Iran war disrupted global LPG supply chains. India's LPG Control Order 2026 capped commercial supply at 20%. In Bengaluru, 90%+ of restaurants dependent on cylinder gas could not operate. Online food orders on Swiggy/Zomato in affected zones collapsed.

**Income impact on Arjun:** Operating from HSR Layout, Arjun's regular restaurant partners, a South Indian chain and a biryani house both shut kitchens on March 10. He logged 9 hours online and completed only 3 orders. Estimated income: ₹180 vs his daily average of ₹980.

**MeowVault trigger:** Activated when a geopolitical supply-chain index (tracking LPG/fuel disruption severity) crosses threshold AND platform order-density in rider's active zone drops below 40% of the 30-day average for 4+ hours.

**Payout:** 70% of declared daily income per qualifying disruption day.

---

####  Scenario 2 — Urban Flooding / Heavy Monsoon (Seasonal Risk: June–October)
**What happened (precedent):** Bengaluru's drainage infrastructure is notoriously inadequate. In 2022 and 2023, areas like Marathahalli, Bellandur, and Sarjapur Road were submerged for 24–72 hours, halting deliveries entirely. The IMD frequently issues red alerts for the city during peak monsoon.

**Income impact:** Arjun cannot safely ride a two-wheeler in flooded conditions. Restaurants may be operational, but pickup and drop zones are inaccessible.

**MeowVault trigger:** IMD red alert for Bengaluru + rainfall ≥ 25mm/hr for 2+ consecutive hours in rider's active zone polygon.

**Payout:** 60% of declared daily income per qualifying day.

---

####  Scenario 3 — Extreme Heat Advisory (April–June)
**What happened:** Bengaluru, historically temperate, recorded temperatures above 38–40°C during April–May 2024 and 2025, prompting BBMP advisories discouraging outdoor work between 12–4pm. Delivery platform order rates dropped 30–40% during peak heat windows.

**Income impact:** Arjun must avoid riding during peak heat. His effective working window shrinks by 3–4 hours, cutting daily orders by 25–35%.

**MeowVault trigger:** Temperature ≥ 40°C for 3+ consecutive hours (Open-Meteo API) AND active government heat advisory.

**Payout:** 30% of declared daily income for each qualifying day.

---

####  Scenario 4 — Platform Algorithmic Shutdown / Shadow Ban (Early 2026)
**What happened:** Karnataka App-Based Drivers Union documented cases in early 2026 where riders participating in protests had their order assignments algorithmically suppressed. Riders received no formal deactivation notice, just a sudden, unexplained drop in orders. This falls under the "algorithmic control" problem highlighted by IFAT's strikes.

**Income impact:** Arjun, after filing a complaint about unfair incentive cuts, notices his order rate drops from 18/day to 4/day. No notification, no appeal. The Karnataka Gig Workers Act 2025 applies, but enforcement is slow.

**MeowVault trigger:** Platform API (simulated) signals < 30% of rider's 30-day average orders for 3+ consecutive days with no self-reported break, cross-validated against zone-wide order density (ruling out normal slow days).

**Payout:** 50% of declared daily income per qualifying day (capped at 5 days per policy period to prevent abuse).

---

####  Scenario 5 — Civic Strike / Bandh / Curfew
**What happened:** The December 25 and December 31, 2025 strikes led by IFAT and TGPWU disrupted deliveries across Bengaluru. Riders who wanted to work in affected zones could not access pickup or drop locations. Section 144 has also been imposed in Bengaluru during political unrest, effectively halting outdoor mobility.

**Income impact:** Arjun wants to work but zone access is physically blocked or platform operations are suspended. Zero deliveries. Zero income.

**MeowVault trigger:** Government civic advisory API (Section 144 / bandh notification) OR platform-reported operational suspension for rider's zone for 3+ hours.

**Payout:** 80% of declared daily income per qualifying disruption day.

---

## 4. Application Workflow

MeowVault is built on a zero-friction principle: **Arjun should never need to open the app to file a claim.** The system monitors, detects, validates, and pays — automatically.

```
┌─────────────────────────────────────────────────────────────┐
│                    MEOWVAULT WORKFLOW                        │
└─────────────────────────────────────────────────────────────┘

  [1] ONBOARDING (3 minutes)
      ├── Phone number + Aadhaar verification (mock)
      ├── Swiggy/Zomato Partner ID linkage (simulated API)
      ├── Declare active delivery zones (map polygon selection)
      ├── Declare average weekly income bracket
      └── UPI ID for payouts

         ↓

  [2] AI PRICING ENGINE
      ├── Ingests: weather history, political risk index, AQI data,
      │           platform order-density signals, zone risk score,
      │           global commodity/LPG disruption index, news NLP
      ├── Outputs: personalised weekly premium (₹) + coverage cap
      └── Updates every Monday morning before auto-renewal

         ↓

  [3] SUBSCRIPTION
      ├── Rider reviews AI-generated quote with plain-language explanation
      ├── Pays weekly premium via UPI (auto-debit with consent)
      └── Coverage activates instantly for 7 days

         ↓

  [4] REAL-TIME DISRUPTION MONITOR (runs 24/7, every 15 min)
      ├── Polls: IMD weather API, Open-Meteo, CPCB AQI
      ├── Polls: LPG/commodity disruption index, news NLP signals
      ├── Polls: Government advisory API (civic alerts, Section 144)
      ├── Polls: Platform order-density signal (simulated)
      └── Evaluates trigger thresholds for each enrolled rider's zones

         ↓

  [5] FRAUD VALIDATION (automated, < 2 seconds)
      ├── GPS cross-check: Is rider actually offline?
      ├── Platform signal: Confirms order drought in zone
      ├── Historical baseline: Is this anomalous vs. rider's own pattern?
      └── Duplicate check: No overlapping active claims

         ↓

  [6] AUTO-CLAIM & PAYOUT
      ├── Claim auto-approved if fraud score < threshold
      ├── UPI payout initiated instantly (Razorpay sandbox)
      └── Push notification: "LPG crisis detected in HSR Layout.
          ₹686 income protection payout sent to your UPI. 🐾"

         ↓

  [7] DASHBOARD
      ├── Rider view: Weekly earnings protected, active coverage,
      │             payout history, upcoming renewal
      └── Insurer (Admin) view: Loss ratios, active policies,
                               next-week predicted disruption claims
```

---

## 5. AI-Driven Weekly Pricing Engine

This is the core innovation of MeowVault. Unlike traditional insurance where an actuary manually sets premium tables, **MeowVault's premium is 100% computed by an AI pipeline** that ingests live, multi-source data every week and generates a personalised quote for each rider before their next renewal.

### 5.1 The Problem with Manual Premium Tables

Traditional parametric insurance would set a flat ₹79/week for "Bengaluru food delivery." But a rider in flood-prone Bellandur faces radically different risk from one in elevated Jayanagar. A week in which LPG supply is at 20% nationally, the monsoon forecast is red, and geopolitical news is volatile is categorically different from a calm January week. Static tables cannot capture this.

### 5.2 Data Inputs to the AI Pricing Engine

The AI engine ingests the following data sources **fresh every Monday** before computing the week's premium:

| Data Category | Source | What It Captures |
|---|---|---|
| **Hyperlocal Weather Forecast** | Open-Meteo API (free) + IMD | Predicted rainfall, temperature, humidity for each zone for the coming 7 days |
| **AQI / Pollution Forecast** | CPCB API / AQI India | Predicted pollution severity — high AQI weeks cost riders outdoor hours |
| **Geopolitical & Commodity News (NLP)** | NewsAPI + custom NLP classifier | Detects LPG/fuel shortage risk, war escalation signals, commodity supply chain alerts |
| **LPG Supply Disruption Index** | Govt MoPNG press releases + commodity APIs | Tracks current % of commercial LPG supply vs. average — the March 2026 Iran war crisis would spike this index sharply |
| **Platform Order Density Signal** | Simulated platform API | Rolling 30-day average orders in each zone — declining trends flag demand-side risk |
| **Zone Historical Disruption Score** | Internal database (built from public IMD/CPCB history) | How many disruption days this zone has had in the past 90 days |
| **Civic Risk Signal** | Government advisory API (mock) | Upcoming elections, political events, historical bandh patterns |
| **Seasonal Risk Multiplier** | Calendar + IMD seasonal outlook | Monsoon onset, peak summer, festive demand spikes |
| **Rider Behaviour Profile** | Internal | Rider's consistency, declared income bracket, past claim history |

### 5.3 How the AI Computes the Premium

The engine runs a **two-stage pipeline**:

**Stage 1 — Risk Score Generation (ML Model)**

A trained gradient boosted model (XGBoost) takes all the above inputs and outputs a **composite weekly risk score** (0–100) for each rider-zone combination. The model is trained on:
- Historical disruption events in Bengaluru (monsoons, AQI spikes, civic events)
- LPG/commodity crisis scenarios (synthetic + real March 2026 data)
- Platform order density histories

**Stage 2 — Premium Calculation (Actuarial Formula + AI Adjustment)**

```
Base Premium = (Declared Weekly Income × Coverage Ratio × Risk Score) / 1000

AI Adjustments applied:
  + Geopolitical Surge Factor  (0.0 – 0.4, based on news NLP + LPG index)
  + Seasonal Multiplier         (0.9 – 1.3)
  + Zone Flood Premium          (0.0 – 0.2 for high-waterlog zones)
  - Rider Loyalty Discount      (up to -0.15 for 8+ weeks continuous coverage)
  - Low-Claim Discount          (up to -0.10 for zero claims in past 4 weeks)

Final Weekly Premium = Base × All Adjustments
                       (capped: ₹39 min — ₹149 max)
```

### 5.4 Bengaluru Example — Week of March 10–17, 2026

> This is not hypothetical. This is what MeowVault would have computed for the actual week of the LPG crisis.

**Rider:** Arjun | **Zone:** HSR Layout + Koramangala | **Declared weekly income:** ₹6,000

| Input Signal | Value This Week | Risk Contribution |
|---|---|---|
| IMD 7-day forecast | 2 days of rain predicted (moderate) | +8 pts |
| AQI forecast | Moderate (AQI ~120) | +3 pts |
| LPG Disruption Index | **CRITICAL** — commercial supply at 20% nationally | **+35 pts** |
| Geopolitical NLP (Iran war) | High conflict escalation detected | **+18 pts** |
| Platform order density | Down 38% vs. 30-day average (restaurants shutting) | **+14 pts** |
| Zone historical disruption | HSR Layout: 12 disruption days in past 90 | +6 pts |
| Seasonal multiplier | March — pre-monsoon, moderate | ×1.05 |
| Rider loyalty discount | 6 continuous weeks | −8 pts |

**Composite Risk Score:** 76 / 100 *(High — reflecting the LPG crisis week)*

**Premium Calculation:**
```
Base = (₹6,000 × 0.70 × 76) / 1000 = ₹319.2
Geopolitical Surge Factor: ×1.35
Seasonal Multiplier: ×1.05
Zone Flood Premium: +₹8
Loyalty Discount: −₹18
────────────────────────────
Final Weekly Premium: ₹130
Coverage Cap this week: ₹4,200
```

**In a normal low-risk week (January 2026, no disruptions forecast):**
Risk Score would drop to ~28. Premium: ₹49. Coverage cap: ₹3,500.

**The AI dynamically reflects reality.** Arjun pays more in a week when he is genuinely at high risk, and less in a calm week — making the product both fair and financially sustainable.

### 5.5 Plain-Language Explanation (What Arjun Sees in the App)

```
 Your MeowVault quote for Mar 10–17

  Weekly premium:  ₹130
  Coverage cap:    ₹4,200

  Why is it higher this week?

  •  Cooking gas shortage (Iran war) — restaurants in your zones
    may not be able to take orders. High income risk.
  •  2 days of rain forecast for Koramangala area.
  •  Order volume in HSR Layout is down 38% this week.

  [Activate Coverage — Pay ₹130 via UPI]
```

---

## 6. Parametric Trigger Definitions

A trigger fires **only when an independently verifiable third-party data source crosses a threshold.** Arjun never files a claim. The system detects and validates automatically.

| Trigger | Threshold | Data Source | Payout |
|---|---|---|---|
| **LPG / Restaurant Supply Shock** | LPG disruption index > 60% severity AND zone order density < 40% of 30-day avg for 4+ hrs | MoPNG API + Platform signal | 70% of declared daily income |
| **Heavy Rain / Flood** | Rainfall ≥ 25mm/hr for 2+ consecutive hours in active zone | IMD / Open-Meteo | 60% of declared daily income |
| **Extreme Heat** | Temperature ≥ 40°C for 3+ consecutive hours + govt heat advisory | Open-Meteo + BBMP API | 30% of declared daily income |
| **Severe Pollution** | AQI ≥ 400 for 3+ continuous hours in active zone | CPCB API | 50% of declared daily income |
| **Civic Disruption / Bandh / Curfew** | Govt advisory API: Section 144 or bandh notification for rider's zone ≥ 3 hrs | Govt advisory API (mock) | 80% of declared daily income |
| **Algorithmic Order Suppression** | < 30% of rider's 30-day order avg for 3+ consecutive days (no self-reported break) AND zone density normal | Platform API (simulated) | 50% of declared daily income (max 5 days/period) |

---

## 7. AI / ML Integration Plan

### 7.1 Weekly Premium Pricing Model
- **Algorithm:** XGBoost Gradient Boosted Regressor
- **Training data:** Synthetic dataset built from public IMD/CPCB historical data for Bengaluru (2021–2025), real March 2026 LPG disruption data, platform order density patterns
- **Inference:** Runs every Monday 5am IST for each active rider
- **Output:** Composite risk score (0–100) → premium amount → coverage cap

### 7.2 News & Geopolitical NLP Classifier
- **Purpose:** Detect emerging supply-chain, political, or commodity risks that will affect delivery income *before* they appear in weather/AQI APIs
- **Architecture:** Fine-tuned text classifier (DistilBERT or zero-shot with Claude API) that reads top news headlines daily and scores them for "gig income disruption risk"
- **Example:** A headline like "Strait of Hormuz closure widens — LPG tankers divert" would push the Geopolitical Surge Factor from 0.0 to 0.38 *days before* restaurants actually run out of gas
- **Data source:** NewsAPI (free tier) filtered for India + energy + geopolitics

### 7.3 Fraud Detection Engine
The fraud engine runs asynchronously on every auto-triggered claim event and outputs a Fraud Risk Score (0–100). Claims scoring < 30 auto-approve. Claims scoring 30–60 go to a 2-hour soft hold. Claims scoring > 60 are flagged for manual review.

| Fraud Signal | Detection Method |
|---|---|
| GPS Spoofing | Last GPS ping cross-checked against declared active zone; jumps > 5km in 5 min flagged |
| Activity Mismatch | Platform signal: if deliveries were completed during claimed disruption window, claim is rejected |
| Duplicate Claims | System prevents overlapping active disruption windows for same rider |
| Claim Velocity Anomaly | Isolation Forest model flags riders claiming every single week when their zone has no corroborating disruption event |
| Zone Corroboration | Checks if 3+ other riders in same zone are also triggering — lone triggers in otherwise-normal zones are suspicious |

### 7.4 Predictive Disruption Forecasting (Admin Dashboard)
- A secondary model forecasts next-week expected claim volume for the insurer dashboard
- Inputs: 14-day weather forecast + LPG index + political calendar + seasonal trends
- Output: "Predicted claims next week: 340 riders | Estimated payout: ₹2.4L"
- Allows the insurer to manage reserve adequacy proactively

---

## 8. Platform Choice Justification

**MeowVault is a Progressive Web App (PWA), not a native Android/iOS app.**

| Factor | PWA | Native App |
|---|---|---|
| Installation | Shareable via WhatsApp link / QR code — no Play Store needed | Requires Play Store download (friction for low-tech users) |
| Low-end device support | Works on Redmi/Realme entry-level devices with intermittent data | Same, but larger APK size |
| Offline capability | Service workers enable offline dashboard viewing | Requires explicit offline mode build |
| Push notifications | Supported natively on Android (disruption alerts, payouts) | Full support |
| Development speed | Single React codebase for 6-week hackathon | Separate iOS/Android builds add weeks |
| Play Store review | None — instant updates | 2–5 day review delays per update |

**Key insight:** A delivery partner in Bengaluru is far more likely to tap a WhatsApp link than download an insurance app from the Play Store. PWA removes the biggest adoption barrier.

---

## 9. Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| **Frontend** | React (TypeScript) — PWA | Component reuse, offline support, single codebase |
| **Backend API** | FastAPI (Python) | Async ML model serving + lightweight REST |
| **Database** | PostgreSQL + Redis | Policy/claim relational data + trigger event caching |
| **ML / Pricing Model** | XGBoost + scikit-learn | Weekly premium computation; fast inference |
| **NLP / News Classifier** | Claude API (claude-sonnet-4-6) | Zero-shot geopolitical risk scoring from news headlines |
| **Weather API** | Open-Meteo (free tier) | Reliable, free, India-specific forecasts |
| **AQI API** | CPCB / AQI India (mock fallback) | Real-time pollution data |
| **LPG / Commodity Index** | Custom scraper (MoPNG press + commodity APIs) | Novel signal — no ready API exists |
| **Platform Signal** | Simulated mock API | Order density data (production: Swiggy/Zomato partner API) |
| **Payments** | Razorpay Test Mode + UPI Sandbox | Simulated instant UPI payouts |
| **Fraud Detection** | Isolation Forest (scikit-learn) | Anomaly detection on claim velocity |
| **Deployment** | Docker + Railway / Render (free tier) | One-command deploy for demo |

### Architecture Diagram (High-Level)

<br>
<img src="https://github.com/RealGameTheory/Devtrails/blob/main/images/DevTrails_arch.png" alt="Alt text" width="1000" height="900">
</br>

---

> **MeowVault — Protecting Every Delivery, Every Week. 🐾**
>
> *Guidewire DEVTrails 2026 | Phase 1 Submission*
