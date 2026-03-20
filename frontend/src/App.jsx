import { useState, useEffect, useCallback } from "react";

/* ══════════════════════════════════════════════════════
   THEME SYSTEM
══════════════════════════════════════════════════════ */
const T = {
  dark: {
    bg:          "#060d18",
    bgAlt:       "#0a1525",
    surface:     "#0e1c2f",
    surfaceHi:   "#122338",
    card:        "#112030",
    border:      "#1a3050",
    borderHi:    "#234470",
    blue:        "#3b9eff",
    blueBright:  "#60b4ff",
    blueDeep:    "#1a7adf",
    blueDim:     "#0c1e3a",
    blueGlow:    "rgba(59,158,255,0.18)",
    cyan:        "#22d4f0",
    cyanDim:     "#071e26",
    amber:       "#f5a623",
    amberDim:    "#251800",
    green:       "#22d37a",
    greenDim:    "#061a12",
    red:         "#ff5a5a",
    redDim:      "#1e0808",
    text:        "#e4f0ff",
    textSub:     "#7a9fc2",
    textMuted:   "#3d5f80",
    shadow:      "rgba(0,0,0,0.6)",
    shadowCard:  "0 4px 32px rgba(0,0,0,0.45)",
  },
  light: {
    bg:          "#eef4fc",
    bgAlt:       "#e4eef8",
    surface:     "#ffffff",
    surfaceHi:   "#f4f8ff",
    card:        "#ffffff",
    border:      "#c4daf0",
    borderHi:    "#90b8e4",
    blue:        "#1a6fd4",
    blueBright:  "#2481f0",
    blueDeep:    "#0f52a8",
    blueDim:     "#deeeff",
    blueGlow:    "rgba(26,111,212,0.14)",
    cyan:        "#0891b2",
    cyanDim:     "#cff5fc",
    amber:       "#b8720a",
    amberDim:    "#fff4d6",
    green:       "#0a8a48",
    greenDim:    "#d8f5e8",
    red:         "#cc2e2e",
    redDim:      "#ffecec",
    text:        "#07111e",
    textSub:     "#376090",
    textMuted:   "#7aa0bf",
    shadow:      "rgba(0,40,100,0.10)",
    shadowCard:  "0 2px 20px rgba(0,40,100,0.09)",
  },
};

/* ══════════════════════════════════════════════════════
   GLOBAL STYLES
══════════════════════════════════════════════════════ */
function injectGlobalStyles() {
  if (document.getElementById("mv-styles")) return;
  const el = document.createElement("style");
  el.id = "mv-styles";
  el.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html, body, #root { height: 100%; }
    body { font-family: 'Plus Jakarta Sans', sans-serif; -webkit-font-smoothing: antialiased; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(100,150,220,0.25); border-radius: 10px; }
    input, select, button, textarea { font-family: inherit; }
    button { cursor: pointer; border: none; background: none; }

    @keyframes fadeUp   { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes pulse    { 0%,100%{transform:scale(1);opacity:.8;} 50%{transform:scale(2.1);opacity:0;} }
    @keyframes spin     { to { transform: rotate(360deg); } }
    @keyframes toastUp  { from{opacity:0;transform:translateX(-50%) translateY(10px);} to{opacity:1;transform:translateX(-50%) translateY(0);} }
    @keyframes glowBeat { 0%,100%{box-shadow:0 0 0 0 rgba(59,158,255,.35);} 50%{box-shadow:0 0 0 8px rgba(59,158,255,0);} }

    .mv-anim { animation: fadeUp .38s ease both; }
    .mv-anim-2 { animation: fadeUp .42s .06s ease both; }
    .mv-anim-3 { animation: fadeUp .46s .12s ease both; }
    .mv-anim-4 { animation: fadeUp .50s .18s ease both; }

    /* Responsive helpers */
    @media (min-width: 768px) {
      .mob-only { display: none !important; }
    }
    @media (max-width: 767px) {
      .desk-only { display: none !important; }
    }
  `;
  document.head.appendChild(el);
}

/* ══════════════════════════════════════════════════════
   CONSTANTS
══════════════════════════════════════════════════════ */
const ZONES = ["HSR Layout","Koramangala","BTM Layout","Indiranagar","JP Nagar","Jayanagar","Bellandur","Sarjapur Road"];

const INCOME_OPTS = [
  { label:"₹3,000 – ₹4,000", sub:"~₹550/day", premium:88,  cap:2800 },
  { label:"₹4,000 – ₹5,500", sub:"~₹750/day", premium:109, cap:3500 },
  { label:"₹5,500 – ₹7,000", sub:"~₹900/day", premium:130, cap:4200 },
  { label:"₹7,000 – ₹9,000", sub:"~₹1,100/day",premium:149, cap:5100 },
];

const ENGINE_STEPS = [
  { icon:"🌤", text:"Fetching Open-Meteo 7-day forecast" },
  { icon:"💨", text:"Reading CPCB AQI index" },
  { icon:"📡", text:"NewsAPI + Claude NLP — geopolitical scan" },
  { icon:"📊", text:"Platform order density signal" },
  { icon:"📍", text:"Zone historical disruption scoring" },
  { icon:"🤖", text:"XGBoost gradient boost model" },
  { icon:"🎯", text:"Seasonal & loyalty adjustments" },
  { icon:"✅", text:"Personalised quote ready" },
];

const PAYOUTS = [
  { event:"Geopolitical supply crisis", date:"Mar 10, 2026", amt:686, status:"sent",       trigger:"Order drought > 4h · Fraud score: 11 · Auto-approved" },
  { event:"Geopolitical supply crisis", date:"Mar 11, 2026", amt:686, status:"sent",       trigger:"Zone density < 40% avg · Platform signal confirmed" },
  { event:"Geopolitical supply crisis", date:"Mar 12, 2026", amt:588, status:"sent",       trigger:"Platform signal confirmed · No claim filed" },
  { event:"Heavy rain — Koramangala",  date:"Mar 13, 2026", amt:534, status:"processing", trigger:"IMD Red · 25mm/hr · 2h 18m · Validating..." },
];

const MONITORS = [
  { name:"Platform density", val:"−38%", sub:"HSR / Kora",    level:"alert" },
  { name:"Geopolitical NLP", val:"HIGH", sub:"Crisis active",  level:"alert" },
  { name:"IMD forecast",     val:"Rain", sub:"Wed + Thu",      level:"warn"  },
  { name:"AQI index",        val:"120",  sub:"Moderate",       level:"warn"  },
  { name:"Temp max",         val:"32°C", sub:"Safe range",     level:"ok"    },
  { name:"Civic alerts",     val:"None", sub:"No bandh / 144", level:"ok"    },
];

const fmt = (n) => "₹" + Number(n).toLocaleString("en-IN");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ══════════════════════════════════════════════════════
   SHARED UI ATOMS
══════════════════════════════════════════════════════ */
function Mono({ children, style }) {
  return <span style={{ fontFamily:"'JetBrains Mono',monospace", ...style }}>{children}</span>;
}

function SectionLabel({ children, t }) {
  return (
    <div style={{ fontSize:10.5, fontWeight:700, letterSpacing:".1em", textTransform:"uppercase",
      color:t.textMuted, fontFamily:"'JetBrains Mono',monospace", marginBottom:12 }}>
      {children}
    </div>
  );
}

function Pill({ children, color, bg }) {
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"3px 10px",
      borderRadius:20, fontSize:11, fontWeight:600, letterSpacing:".04em",
      color, background:bg, border:`1px solid ${color}44`,
      fontFamily:"'JetBrains Mono',monospace" }}>
      {children}
    </span>
  );
}

function Divider({ t, my=16 }) {
  return <div style={{ height:1, background:t.border, margin:`${my}px 0` }} />;
}

function PrimaryBtn({ children, onClick, disabled, t }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} disabled={disabled}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width:"100%", padding:"14px 20px", borderRadius:12,
        fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:15, fontWeight:700,
        background: disabled ? t.surfaceHi : `linear-gradient(120deg, ${t.blue}, ${t.blueDeep})`,
        color: disabled ? t.textMuted : "#fff",
        boxShadow: disabled ? "none" : hov ? `0 8px 32px ${t.blueGlow}` : `0 4px 20px ${t.blueGlow}`,
        transform: hov && !disabled ? "translateY(-2px)" : "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition:"all .2s",
      }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick, t }) {
  return (
    <button onClick={onClick} style={{
      padding:"14px 22px", borderRadius:12,
      border:`1.5px solid ${t.border}`,
      color:t.textSub, fontSize:14, fontWeight:600,
      transition:"all .18s", flexShrink:0,
      background:"transparent",
    }}>
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════ */
function Toast({ msg, t }) {
  if (!msg) return null;
  return (
    <div style={{
      position:"fixed", bottom:80, left:"50%",
      background:t.card, border:`1px solid ${t.blue}`,
      borderRadius:12, padding:"12px 24px",
      fontSize:13.5, color:t.text, whiteSpace:"nowrap",
      zIndex:9999, animation:"toastUp .3s ease",
      boxShadow:`0 8px 32px ${t.shadow}`, fontWeight:500,
    }}>
      {msg}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DESKTOP SIDEBAR
══════════════════════════════════════════════════════ */
function SideNav({ screen, setScreen, t, unlocked, isDark, toggleTheme }) {
  const items = [
    { id:"onboard", icon:"◈", label:"Setup",     sub:"Profile & zones" },
    { id:"quote",   icon:"◎", label:"Quote",     sub:"AI pricing engine" },
    { id:"dash",    icon:"▦", label:"Dashboard", sub:"Live coverage" },
  ];
  return (
    <div className="desk-only" style={{
      width:230, flexShrink:0, background:t.surface,
      borderRight:`1px solid ${t.border}`,
      display:"flex", flexDirection:"column", height:"100vh",
      position:"sticky", top:0,
    }}>
      {/* Brand */}
      <div style={{ padding:"26px 22px 20px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:4 }}>
          <div style={{
            width:42, height:42, borderRadius:13,
            background:`linear-gradient(135deg, ${t.blue}, ${t.blueDeep})`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:21, boxShadow:`0 4px 18px ${t.blueGlow}`, flexShrink:0,
          }}>🐾</div>
          <div>
            <div style={{ fontWeight:800, fontSize:17, color:t.text, letterSpacing:"-.4px" }}>MeowVault</div>
            <Mono style={{ fontSize:9.5, color:t.textMuted, display:"block", letterSpacing:".05em" }}>INCOME PROTECTION</Mono>
          </div>
        </div>
      </div>
      <Divider t={t} my={0} />

      {/* Nav */}
      <div style={{ flex:1, padding:"14px 10px", overflowY:"auto" }}>
        <SectionLabel t={t}>Navigation</SectionLabel>
        {items.map(item => {
          const active = screen === item.id;
          const locked = item.id !== "onboard" && !unlocked;
          return (
            <button key={item.id} onClick={() => !locked && setScreen(item.id)}
              style={{
                width:"100%", display:"flex", alignItems:"center", gap:12,
                padding:"11px 14px", borderRadius:10, marginBottom:3,
                background: active ? t.blueDim : "transparent",
                border: active ? `1px solid ${t.blue}55` : "1px solid transparent",
                color: active ? t.blueBright : locked ? t.textMuted : t.textSub,
                cursor: locked ? "not-allowed" : "pointer",
                textAlign:"left", opacity: locked ? 0.45 : 1,
                transition:"all .18s",
              }}>
              <span style={{ fontSize:19, lineHeight:1, flexShrink:0 }}>{item.icon}</span>
              <div style={{ minWidth:0 }}>
                <div style={{ fontSize:13.5, fontWeight:600 }}>{item.label}</div>
                <div style={{ fontSize:11, color:t.textMuted, marginTop:1 }}>{item.sub}</div>
              </div>
              {active && <div style={{ marginLeft:"auto", width:3, height:22, borderRadius:2, background:t.blue, flexShrink:0 }} />}
            </button>
          );
        })}
      </div>

      <Divider t={t} my={0} />
      <div style={{ padding:"14px 10px 22px" }}>
        <button onClick={toggleTheme} style={{
          width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"11px 14px", borderRadius:10,
          background:t.surfaceHi, border:`1px solid ${t.border}`,
          color:t.textSub, fontSize:13, fontWeight:500, transition:"all .18s",
        }}>
          <span>{isDark ? "☀️  Light mode" : "🌙  Dark mode"}</span>
          <Mono style={{ fontSize:10, color:t.textMuted }}>⌘D</Mono>
        </button>
        <Mono style={{ display:"block", marginTop:14, fontSize:9.5, color:t.textMuted, textAlign:"center" }}>
          Phase 1 · DEVTrails 2026
        </Mono>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE TOP BAR
══════════════════════════════════════════════════════ */
function MobileTopBar({ t, isDark, toggleTheme, hasCoverage }) {
  return (
    <div className="mob-only" style={{
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"13px 18px", background:t.surface, borderBottom:`1px solid ${t.border}`,
      position:"sticky", top:0, zIndex:20, flexShrink:0,
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
        <div style={{
          width:36, height:36, borderRadius:10, flexShrink:0,
          background:`linear-gradient(135deg,${t.blue},${t.blueDeep})`,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:18, boxShadow:`0 3px 12px ${t.blueGlow}`,
        }}>🐾</div>
        <div>
          <div style={{ fontWeight:800, fontSize:15, color:t.text, letterSpacing:"-.3px" }}>MeowVault</div>
          <Mono style={{ fontSize:9.5, color:t.textMuted, display:"block" }}>INCOME PROTECTION</Mono>
        </div>
      </div>
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {hasCoverage && (
          <div style={{ display:"flex", alignItems:"center", gap:5, background:t.greenDim, border:`1px solid ${t.green}55`, borderRadius:20, padding:"4px 10px" }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:t.green, animation:"pulse 1.8s infinite" }} />
            <Mono style={{ fontSize:10, color:t.green, fontWeight:600 }}>LIVE</Mono>
          </div>
        )}
        <button onClick={toggleTheme} style={{
          background:t.surfaceHi, border:`1px solid ${t.border}`, borderRadius:20,
          padding:"6px 13px", fontSize:13, color:t.textSub,
        }}>{isDark ? "☀" : "◑"}</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MOBILE BOTTOM NAV
══════════════════════════════════════════════════════ */
function MobileBottomNav({ screen, setScreen, t, unlocked }) {
  const items = [
    { id:"onboard", icon:"◈", label:"Setup" },
    { id:"quote",   icon:"◎", label:"Quote" },
    { id:"dash",    icon:"▦", label:"Dashboard" },
  ];
  return (
    <div className="mob-only" style={{
      display:"flex", borderTop:`1px solid ${t.border}`,
      background:t.surface, position:"sticky", bottom:0, zIndex:20, flexShrink:0,
    }}>
      {items.map(({ id, icon, label }) => {
        const locked = id !== "onboard" && !unlocked;
        const active = screen === id;
        return (
          <button key={id} onClick={() => !locked && setScreen(id)} style={{
            flex:1, padding:"10px 4px 13px",
            display:"flex", flexDirection:"column", alignItems:"center", gap:4,
            color: active ? t.blue : locked ? t.textMuted : t.textSub,
            opacity: locked ? 0.4 : 1,
            cursor: locked ? "not-allowed" : "pointer", transition:"color .18s",
          }}>
            <span style={{ fontSize:22, lineHeight:1, filter: active ? `drop-shadow(0 0 7px ${t.blue})` : "none", transition:"filter .3s" }}>{icon}</span>
            <Mono style={{ fontSize:9.5, fontWeight: active ? 600 : 400 }}>{label}</Mono>
          </button>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ONBOARDING SCREEN
══════════════════════════════════════════════════════ */
function OnboardScreen({ t, onComplete }) {
  const [step, setStep]       = useState(0);
  const [phone, setPhone]     = useState("");
  const [platform, setPlatform] = useState("Swiggy");
  const [pid, setPid]         = useState("SW-BLR-48821");
  const [zones, setZones]     = useState([]);
  const [income, setIncome]   = useState(null);
  const [upi, setUpi]         = useState("");

  const canNext = [
    phone.length >= 7,
    zones.length >= 1,
    income !== null,
    upi.length >= 5,
  ][step];

  const toggleZone = (z) =>
    setZones(prev => prev.includes(z) ? prev.filter(x => x !== z) : prev.length < 4 ? [...prev, z] : prev);

  const inputCss = {
    width:"100%", padding:"12px 16px",
    background:t.surfaceHi, border:`1.5px solid ${t.border}`,
    borderRadius:11, color:t.text, fontSize:14, outline:"none",
    transition:"border-color .2s",
  };
  const onFocus = e => { e.target.style.borderColor = t.blue; };
  const onBlur  = e => { e.target.style.borderColor = t.border; };

  const stepTitles = [
    ["Identity Verification",   "Phone number & partner ID linkage"],
    ["Delivery Zones",          "Select your active zones in Bengaluru (up to 4)"],
    ["Income Bracket",          "Sets your coverage cap & daily payout amounts"],
    ["UPI Payout Details",      "Where your income protection lands instantly"],
  ];

  const steps = [
    /* 0 - Identity */
    <div key={0} className="mv-anim" style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div>
        <SectionLabel t={t}>Mobile Number</SectionLabel>
        <input style={inputCss} type="tel" placeholder="+91 98765 43210"
          value={phone} onChange={e => setPhone(e.target.value)}
          onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div>
        <SectionLabel t={t}>Delivery Platform</SectionLabel>
        <select style={{ ...inputCss, appearance:"none", cursor:"pointer" }}
          value={platform} onChange={e => setPlatform(e.target.value)}
          onFocus={onFocus} onBlur={onBlur}>
          {["Swiggy","Zomato","Both"].map(o => <option key={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <SectionLabel t={t}>Partner ID (auto-fetched from platform)</SectionLabel>
        <input style={inputCss} placeholder="SW-BLR-48821"
          value={pid} onChange={e => setPid(e.target.value)}
          onFocus={onFocus} onBlur={onBlur} />
      </div>
    </div>,

    /* 1 - Zones */
    <div key={1} className="mv-anim" style={{ display:"flex", flexDirection:"column", gap:12 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
        {ZONES.map(z => {
          const sel = zones.includes(z);
          const maxed = zones.length >= 4 && !sel;
          return (
            <button key={z} onClick={() => toggleZone(z)} style={{
              padding:"12px 14px", borderRadius:11, fontSize:13, fontWeight:500,
              border:`1.5px solid ${sel ? t.blue : t.border}`,
              background: sel ? t.blueDim : t.surfaceHi,
              color: sel ? t.blueBright : maxed ? t.textMuted : t.textSub,
              cursor: maxed ? "not-allowed" : "pointer",
              transition:"all .16s", textAlign:"left",
            }}>
              {sel && <span style={{ marginRight:6, fontSize:12 }}>✓</span>}{z}
            </button>
          );
        })}
      </div>
      {zones.length > 0 && (
        <div style={{ padding:"10px 14px", background:t.blueDim, border:`1px solid ${t.blue}44`, borderRadius:10 }}>
          <Mono style={{ fontSize:12, color:t.blue }}>{zones.length}/4 selected · {zones.join(" · ")}</Mono>
        </div>
      )}
    </div>,

    /* 2 - Income */
    <div key={2} className="mv-anim" style={{ display:"flex", flexDirection:"column", gap:9 }}>
      {INCOME_OPTS.map(item => {
        const sel = income?.label === item.label;
        return (
          <button key={item.label} onClick={() => setIncome(item)} style={{
            padding:"15px 18px", borderRadius:11, cursor:"pointer",
            border:`1.5px solid ${sel ? t.blue : t.border}`,
            background: sel ? t.blueDim : t.surfaceHi,
            display:"flex", alignItems:"center", justifyContent:"space-between",
            transition:"all .16s",
          }}>
            <div style={{ textAlign:"left" }}>
              <div style={{ fontSize:14, fontWeight:700, color: sel ? t.blueBright : t.text }}>{item.label}</div>
              <div style={{ fontSize:12, color:t.textSub, marginTop:3 }}>{item.sub}</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <Mono style={{ fontSize:10, color:t.textMuted, display:"block" }}>Coverage cap</Mono>
              <Mono style={{ fontSize:17, fontWeight:700, color: sel ? t.blue : t.textSub, display:"block", marginTop:3 }}>{fmt(item.cap)}</Mono>
            </div>
          </button>
        );
      })}
    </div>,

    /* 3 - UPI */
    <div key={3} className="mv-anim" style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div>
        <SectionLabel t={t}>UPI ID for Payouts</SectionLabel>
        <input style={inputCss} placeholder="yourname@gpay or @upi"
          value={upi} onChange={e => setUpi(e.target.value)}
          onFocus={onFocus} onBlur={onBlur} />
      </div>
      <div style={{
        padding:"16px 18px", background:t.surfaceHi,
        border:`1px solid ${t.border}`, borderRadius:12,
        fontSize:13, color:t.textSub, lineHeight:1.75,
      }}>
        <div style={{ fontWeight:700, color:t.text, marginBottom:6, fontSize:14 }}>🔒 Razorpay Sandbox Mode</div>
        Payouts are simulated in this prototype. In production, NACH auto-debit consent is collected here and verified via your bank.
      </div>
    </div>,
  ];

  return (
    <div style={{ display:"flex", flexDirection:"column", height:"100%" }}>
      {/* Header */}
      <div style={{ padding:"26px 28px 22px", background:t.surface, borderBottom:`1px solid ${t.border}`, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
          <Mono style={{ fontSize:12, color:t.blue, fontWeight:600 }}>Step {step + 1} of 4</Mono>
          <Mono style={{ fontSize:11, color:t.textMuted }}>{Math.round((step / 4) * 100)}% complete</Mono>
        </div>
        <div style={{ display:"flex", gap:5, marginBottom:18 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{
              height:4, flex:1, borderRadius:2,
              background: i < step ? t.blue : i === step ? t.blueBright : t.border,
              transition:"background .3s",
            }} />
          ))}
        </div>
        <div style={{ fontWeight:800, fontSize:22, color:t.text, letterSpacing:"-.4px" }}>{stepTitles[step][0]}</div>
        <div style={{ fontSize:14, color:t.textSub, marginTop:6 }}>{stepTitles[step][1]}</div>
      </div>

      {/* Form */}
      <div style={{ flex:1, overflowY:"auto", padding:"24px 28px" }}>{steps[step]}</div>

      {/* Actions */}
      <div style={{ padding:"16px 28px 22px", borderTop:`1px solid ${t.border}`, background:t.surface, flexShrink:0, display:"flex", gap:10 }}>
        {step > 0 && <GhostBtn t={t} onClick={() => setStep(s => s - 1)}>← Back</GhostBtn>}
        <PrimaryBtn t={t} disabled={!canNext}
          onClick={() => { if (step < 3) setStep(s => s + 1); else onComplete({ phone, platform, pid, zones, income, upi }); }}>
          {step < 3 ? "Continue →" : "⚡ Run AI Pricing Engine"}
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PRICING ENGINE LOADER
══════════════════════════════════════════════════════ */
function PricingLoader({ t }) {
  const [step, setStep] = useState(-1);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      setStep(i);
      setScore(Math.min(76, Math.round(((i + 1) / ENGINE_STEPS.length) * 76)));
      if (++i >= ENGINE_STEPS.length) clearInterval(iv);
    }, 410);
    return () => clearInterval(iv);
  }, []);

  const pct = ((step + 1) / ENGINE_STEPS.length) * 100;
  const R = 54, circ = 2 * Math.PI * R;

  return (
    <div style={{
      flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"40px 32px", gap:36, animation:"fadeIn .4s ease",
    }}>
      <div style={{ position:"relative", width:148, height:148 }}>
        <svg width={148} height={148} style={{ position:"absolute", top:0, left:0, transform:"rotate(-90deg)" }}>
          <circle cx={74} cy={74} r={R} fill="none" stroke={t.border} strokeWidth={7} />
          <circle cx={74} cy={74} r={R} fill="none" stroke={t.blue} strokeWidth={7}
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - pct / 100)}
            strokeLinecap="round"
            style={{ transition:"stroke-dashoffset .43s cubic-bezier(.4,0,.2,1)", filter:`drop-shadow(0 0 10px ${t.blue})` }}
          />
        </svg>
        <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
          <Mono style={{ fontSize:30, fontWeight:600, color:t.blue, lineHeight:1 }}>{score}</Mono>
          <Mono style={{ fontSize:12, color:t.textMuted }}>/ 100</Mono>
        </div>
      </div>

      <div style={{ width:"100%", maxWidth:360 }}>
        <div style={{ fontWeight:800, fontSize:20, color:t.text, textAlign:"center", marginBottom:24, letterSpacing:"-.3px" }}>AI Pricing Engine</div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {ENGINE_STEPS.map((s, i) => {
            const done = i < step, active = i === step;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:13, opacity: done||active ? 1 : 0.28, transition:"opacity .35s" }}>
                <div style={{
                  width:24, height:24, borderRadius:"50%", flexShrink:0,
                  background: done ? t.blue : "transparent",
                  border: active ? `2px solid ${t.blue}` : done ? "none" : `1.5px solid ${t.border}`,
                  display:"flex", alignItems:"center", justifyContent:"center", fontSize:11,
                }}>
                  {done && <span style={{ color:"#fff", fontWeight:700 }}>✓</span>}
                  {active && <div style={{ width:7, height:7, borderRadius:"50%", background:t.blue, animation:"spin .8s linear infinite" }} />}
                </div>
                <span style={{ fontSize:13.5, color: done ? t.blue : active ? t.text : t.textSub, fontWeight: active ? 600 : 400 }}>
                  {s.icon}  {s.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   RISK BAR
══════════════════════════════════════════════════════ */
function RiskBar({ label, pts, maxPts, color, t, delay }) {
  const [go, setGo] = useState(false);
  useEffect(() => { const tm = setTimeout(() => setGo(true), delay); return () => clearTimeout(tm); }, []);
  const w = `${Math.round(Math.abs(pts) / maxPts * 100)}%`;
  return (
    <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
      <div style={{ flex:1, fontSize:13, color:t.text, minWidth:0, lineHeight:1.4 }}>{label}</div>
      <div style={{ width:110, height:6, background:t.border, borderRadius:3, flexShrink:0, overflow:"hidden" }}>
        <div style={{ height:6, borderRadius:3, background:color, width: go ? w : "0%", transition:"width 1.2s cubic-bezier(.4,0,.2,1)" }} />
      </div>
      <Mono style={{ width:34, textAlign:"right", fontSize:12, color, flexShrink:0 }}>{pts >= 0 ? "+" : ""}{pts}</Mono>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   QUOTE SCREEN
══════════════════════════════════════════════════════ */
function QuoteScreen({ t, obState, onActivate }) {
  const inc = obState.income || INCOME_OPTS[2];
  const highRisk = (obState.zones || []).some(z => ["HSR Layout","Koramangala","Bellandur","Indiranagar"].includes(z));
  const score = highRisk ? 76 : 62;

  const riskRows = [
    { label:"Geopolitical NLP — Iran-Hormuz crisis", pts:18, color:t.red },
    { label:"Platform order density −38%",           pts:14, color:t.amber },
    { label:"Zone historical disruption score",      pts:highRisk ? 8 : 3, color:t.amber },
    { label:"IMD rain forecast (2 days)",            pts:8,  color:t.blue },
    { label:"AQI forecast — Moderate ~120",          pts:3,  color:t.cyan },
    { label:"Loyalty discount (6 weeks)",            pts:-8, color:t.green },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"28px 28px 32px" }}>
      {/* Title */}
      <div className="mv-anim" style={{ marginBottom:20 }}>
        <div style={{ fontWeight:800, fontSize:24, color:t.text, letterSpacing:"-.5px" }}>Your AI Quote</div>
        <Mono style={{ fontSize:12, color:t.textMuted, display:"block", marginTop:6 }}>
          Week of Mar 10–17, 2026 · Computed Mon 05:00 IST · {(obState.zones || ["HSR Layout","Koramangala"]).join(" · ")}
        </Mono>
      </div>

      {/* Alert */}
      <div className="mv-anim-2" style={{
        padding:"14px 18px", marginBottom:20, borderRadius:12,
        background:t.redDim, border:`1px solid ${t.red}55`,
        display:"flex", gap:14, alignItems:"flex-start",
      }}>
        <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>⚠️</span>
        <div style={{ fontSize:13.5, color:t.text, lineHeight:1.65 }}>
          <strong style={{ color:t.red }}>Active disruptions in your zones:</strong> Geopolitical supply chain crisis reducing restaurant order volumes. Platform density down <strong>38%</strong> vs 30-day average.
        </div>
      </div>

      {/* Main card */}
      <div className="mv-anim-3" style={{
        background:t.card, border:`1px solid ${t.border}`,
        borderRadius:16, overflow:"hidden", marginBottom:16,
        boxShadow:t.shadowCard,
      }}>
        <div style={{ height:4, background:`linear-gradient(90deg, ${t.blue}, ${t.cyan})` }} />
        <div style={{ padding:"24px 26px" }}>
          {/* Big price + risk */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", flexWrap:"wrap", gap:16, marginBottom:20 }}>
            <div>
              <SectionLabel t={t}>Weekly Premium</SectionLabel>
              <Mono style={{ fontSize:52, fontWeight:600, color:t.blue, lineHeight:1, letterSpacing:"-2px", display:"block" }}>
                {fmt(inc.premium)}
              </Mono>
              <div style={{ fontSize:13, color:t.textSub, marginTop:8 }}>per week · auto-renews Monday 05:00 AM</div>
            </div>
            <div style={{ textAlign:"right" }}>
              <Pill
                children={`RISK ${score}/100 · ${score > 70 ? "HIGH" : score > 50 ? "MED" : "LOW"}`}
                color={score > 70 ? t.red : score > 50 ? t.amber : t.green}
                bg={score > 70 ? t.redDim : score > 50 ? t.amberDim : t.greenDim}
              />
              <Mono style={{ fontSize:11, color:t.textMuted, display:"block", marginTop:14 }}>Coverage Cap</Mono>
              <Mono style={{ fontSize:26, fontWeight:700, color:t.text, display:"block", marginTop:5 }}>{fmt(inc.cap)}</Mono>
            </div>
          </div>

          {/* Comparison */}
          <div style={{ display:"flex", gap:10, marginBottom:20 }}>
            {[
              { label:"Normal week", val:"₹49",          color:t.green },
              { label:"This week",   val:fmt(inc.premium), color:t.red   },
              { label:"Risk delta",  val:`+${score-28}pts`, color:t.amber },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ flex:1, background:t.surfaceHi, borderRadius:10, padding:"11px 12px", textAlign:"center" }}>
                <Mono style={{ fontSize:10, color:t.textMuted, display:"block", marginBottom:5 }}>{label}</Mono>
                <Mono style={{ fontSize:16, fontWeight:700, color }}>{val}</Mono>
              </div>
            ))}
          </div>

          <Divider t={t} my={18} />

          {/* Risk bars */}
          <SectionLabel t={t}>Signal Breakdown</SectionLabel>
          {riskRows.map((r, i) => <RiskBar key={i} {...r} maxPts={22} t={t} delay={i * 100 + 80} />)}
        </div>
      </div>

      {/* Why card */}
      <div className="mv-anim-4" style={{
        background:t.surfaceHi, border:`1px solid ${t.border}`,
        borderRadius:14, padding:"20px 22px", marginBottom:22,
      }}>
        <SectionLabel t={t}>Why higher this week?</SectionLabel>
        {[
          ["🌍","Geopolitical supply crisis (Iran-Hormuz) has reduced restaurant operational capacity across your zones."],
          ["🌧️","2 days of moderate rain forecast for Koramangala — IMD advisory in effect."],
          ["📉","Platform order volume in HSR Layout is down 38% vs. your 30-day average."],
        ].map(([icon, text], i) => (
          <div key={i} style={{ display:"flex", gap:13, marginBottom:i < 2 ? 14 : 0 }}>
            <span style={{ fontSize:18, flexShrink:0, marginTop:1 }}>{icon}</span>
            <span style={{ fontSize:13.5, color:t.text, lineHeight:1.65 }}>{text}</span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <PrimaryBtn t={t} onClick={onActivate}>
        Activate Coverage — Pay {fmt(inc.premium)} via UPI
      </PrimaryBtn>
      <div style={{ textAlign:"center", fontSize:12, color:t.textMuted, marginTop:10 }}>
        🔒 Razorpay sandbox · Auto-renews Mon 05:00 AM IST
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   DASHBOARD SCREEN
══════════════════════════════════════════════════════ */
function DashScreen({ t, obState }) {
  const inc = obState.income || INCOME_OPTS[2];
  const [expanded, setExpanded] = useState(null);
  const [renewDone, setRenewDone] = useState(false);
  const total = PAYOUTS.filter(p => p.status === "sent").reduce((a, p) => a + p.amt, 0);

  const lvlColor = {
    alert:{ color:t.red,   bg:t.redDim   },
    warn: { color:t.amber, bg:t.amberDim },
    ok:   { color:t.green, bg:t.greenDim },
  };

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"28px 28px 36px" }}>
      {/* Rider card */}
      <div className="mv-anim" style={{
        background:t.card, border:`1px solid ${t.border}`,
        borderRadius:16, padding:"22px 24px", marginBottom:20, boxShadow:t.shadowCard,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:20 }}>
          <div style={{
            width:54, height:54, borderRadius:15, flexShrink:0,
            background:`linear-gradient(135deg,${t.blueDim},${t.surfaceHi})`,
            border:`2px solid ${t.blue}44`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:800, fontSize:18, color:t.blue,
          }}>AK</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:18, color:t.text }}>Arjun Kumar</div>
            <Mono style={{ fontSize:11.5, color:t.textMuted }}>Swiggy · SW-BLR-48821</Mono>
          </div>
          <Pill children="● ACTIVE" color={t.green} bg={t.greenDim} />
        </div>

        <div style={{
          background:t.surfaceHi, borderRadius:12, padding:"14px 18px",
          border:`1px solid ${t.blue}33`, animation:"glowBeat 3.5s ease infinite",
          display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap",
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ position:"relative", width:11, height:11, flexShrink:0 }}>
              <div style={{ position:"absolute", inset:0, borderRadius:"50%", background:t.green }} />
              <div style={{ position:"absolute", inset:-3, borderRadius:"50%", border:`1.5px solid ${t.green}`, animation:"pulse 2s infinite" }} />
            </div>
            <div>
              <div style={{ fontSize:14, fontWeight:600, color:t.text }}>Coverage Active</div>
              <Mono style={{ fontSize:11, color:t.textMuted }}>Expires Mon Mar 17 · 05:00 AM IST</Mono>
            </div>
          </div>
          <Mono style={{ fontSize:14, fontWeight:600, color:t.blue }}>Cap {fmt(inc.cap)}</Mono>
        </div>
      </div>

      {/* Stats */}
      <div className="mv-anim-2" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:22 }}>
        {[
          { val:"3",            lbl:"Disruption Days",  color:t.red  },
          { val:fmt(total),     lbl:"Protected",         color:t.blue },
          { val:fmt(inc.cap-total), lbl:"Cap Remaining", color:t.green },
        ].map(({ val, lbl, color }) => (
          <div key={lbl} style={{
            background:t.card, border:`1px solid ${t.border}`,
            borderRadius:12, padding:"16px 14px", textAlign:"center",
            boxShadow:t.shadowCard,
          }}>
            <Mono style={{ fontSize:20, fontWeight:700, color, display:"block" }}>{val}</Mono>
            <div style={{ fontSize:11, color:t.textMuted, marginTop:6, lineHeight:1.35 }}>{lbl}</div>
          </div>
        ))}
      </div>

      {/* Monitor grid */}
      <div className="mv-anim-3">
        <SectionLabel t={t}>Live Disruption Monitor · Updated 15 min ago</SectionLabel>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:9, marginBottom:24 }}>
          {MONITORS.map((m, i) => {
            const { color, bg } = lvlColor[m.level];
            return (
              <div key={i} style={{
                background:t.card, border:`1px solid ${t.border}`,
                borderRadius:12, padding:"14px 15px",
              }}>
                <Mono style={{ fontSize:11, color:t.textMuted, display:"block", marginBottom:6 }}>{m.name}</Mono>
                <Mono style={{ fontSize:19, fontWeight:600, color:t.text, display:"block" }}>{m.val}</Mono>
                <div style={{ marginTop:8, display:"inline-flex", alignItems:"center", gap:5, background:bg, border:`1px solid ${color}33`, borderRadius:20, padding:"3px 10px" }}>
                  <div style={{ width:5, height:5, borderRadius:"50%", background:color, flexShrink:0 }} />
                  <Mono style={{ fontSize:10.5, color }}>{m.sub}</Mono>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payout history */}
      <div className="mv-anim-4">
        <SectionLabel t={t}>Payout History · Tap row to expand</SectionLabel>
        <div style={{ display:"flex", flexDirection:"column", gap:9, marginBottom:24 }}>
          {PAYOUTS.map((p, i) => (
            <div key={i} style={{
              background:t.card, border:`1px solid ${expanded===i ? t.blue : t.border}`,
              borderRadius:12, overflow:"hidden", cursor:"pointer", transition:"border-color .2s",
            }} onClick={() => setExpanded(expanded === i ? null : i)}>
              <div style={{ padding:"14px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
                <div style={{ minWidth:0 }}>
                  <div style={{ fontSize:13.5, fontWeight:600, color:t.text }}>{p.event}</div>
                  <Mono style={{ fontSize:11, color:t.textMuted, display:"block", marginTop:3 }}>{p.date}</Mono>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <Mono style={{ fontSize:18, fontWeight:700, color: p.status==="processing" ? t.amber : t.green, display:"block" }}>{fmt(p.amt)}</Mono>
                  <Mono style={{ fontSize:10.5, color: p.status==="processing" ? t.amber : t.green }}>
                    {p.status==="processing" ? "⧖ processing" : "✓ UPI sent"}
                  </Mono>
                </div>
              </div>
              {expanded === i && (
                <div style={{ padding:"10px 18px 14px", borderTop:`1px solid ${t.border}`, background:t.surfaceHi, fontSize:13, color:t.textSub, lineHeight:1.65 }}>
                  <Mono style={{ fontSize:11, color:t.blue, display:"block", marginBottom:4 }}>Trigger details</Mono>
                  {p.trigger} · No claim filed by rider · Auto-detected & approved
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Renewal */}
      <div style={{
        background:t.amberDim, border:`1px solid ${t.amber}55`,
        borderRadius:14, padding:"18px 20px", marginBottom:24,
        display:"flex", alignItems:"center", justifyContent:"space-between", gap:14, flexWrap:"wrap",
      }}>
        <div>
          <div style={{ fontSize:14, fontWeight:700, color:t.amber }}>Next Renewal · Mon Mar 17</div>
          <div style={{ fontSize:13.5, color:t.text, marginTop:5 }}>
            AI quote ready: <Mono style={{ fontWeight:700, color:t.amber }}>₹118</Mono> — geopolitical risk easing slightly
          </div>
        </div>
        <button onClick={() => setRenewDone(true)} disabled={renewDone} style={{
          flexShrink:0, background: renewDone ? t.green : t.amber,
          border:"none", borderRadius:10, padding:"11px 20px",
          fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:700, fontSize:13.5,
          color:"#fff", cursor: renewDone ? "default" : "pointer",
          transition:"background .3s", whiteSpace:"nowrap",
        }}>{renewDone ? "✓ Approved" : "Pre-approve"}</button>
      </div>

      {/* Trigger log */}
      <SectionLabel t={t}>Auto-Trigger Log</SectionLabel>
      <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
        {[
          { icon:"🌍", text:"Geopolitical NLP HIGH → order drought > 4h → fraud score 11 → auto-approved & paid", time:"Mar 10 · 09:12 AM", color:t.red },
          { icon:"🌧️", text:"Rainfall ≥ 25mm/hr in Koramangala for 2h 18m · IMD Red confirmed → auto-payout", time:"Mar 13 · 02:44 PM", color:t.blue },
          { icon:"📡", text:"Platform density −38% vs 30-day avg · 3+ days · zone corroborated · monitoring ongoing", time:"Ongoing · 15 min ago", color:t.amber },
        ].map((item, i) => (
          <div key={i} style={{
            background:t.card, border:`1px solid ${t.border}`,
            borderRadius:12, padding:"14px 16px",
            display:"flex", gap:13, alignItems:"flex-start",
          }}>
            <span style={{ fontSize:19, flexShrink:0 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize:13.5, color:t.text, lineHeight:1.6 }}>{item.text}</div>
              <Mono style={{ fontSize:11, color:t.textMuted, display:"block", marginTop:5 }}>{item.time}</Mono>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   ROOT APP
══════════════════════════════════════════════════════ */
export default function App() {
  const [isDark, setIsDark]         = useState(true);
  const [screen, setScreen]         = useState("onboard");
  const [obState, setObState]       = useState({});
  const [unlocked, setUnlocked]     = useState(false);
  const [hasCoverage, setHasCoverage] = useState(false);
  const [toast, setToast]           = useState("");
  const t = T[isDark ? "dark" : "light"];
  const toggleTheme = () => setIsDark(d => !d);

  useEffect(() => { injectGlobalStyles(); }, []);
  useEffect(() => {
    document.body.style.cssText = `background:${t.bg};color:${t.text};height:100%;`;
  }, [isDark]);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  }, []);

  const handleOnboardComplete = async (state) => {
    setObState(state);
    setScreen("__loading");
    await sleep(ENGINE_STEPS.length * 410 + 600);
    setUnlocked(true);
    setScreen("quote");
  };

  const handleActivate = () => {
    showToast("⏳ Processing payment via Razorpay sandbox…");
    setTimeout(() => {
      setHasCoverage(true);
      showToast("🐾 Coverage active! Monitoring begins now.");
      setTimeout(() => setScreen("dash"), 1400);
    }, 1800);
  };

  const activeScreen = screen === "__loading" ? "onboard" : screen;

  return (
    <div style={{ display:"flex", height:"100vh", background:t.bg, color:t.text, overflow:"hidden" }}>
      {/* Desktop sidebar */}
      <SideNav
        screen={activeScreen} setScreen={setScreen}
        t={t} unlocked={unlocked} isDark={isDark} toggleTheme={toggleTheme}
      />

      {/* Main column */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0, overflow:"hidden" }}>
        {/* Mobile top bar */}
        <MobileTopBar t={t} isDark={isDark} toggleTheme={toggleTheme} hasCoverage={hasCoverage} />

        {/* Desktop top header */}
        <div className="desk-only" style={{
          display:"flex", alignItems:"center", justifyContent:"space-between",
          padding:"18px 32px", borderBottom:`1px solid ${t.border}`,
          background:t.surface, flexShrink:0,
        }}>
          <div>
            <div style={{ fontWeight:700, fontSize:13, color:t.textSub, textTransform:"uppercase", letterSpacing:".08em" }}>
              {{ onboard:"Setup", quote:"AI Pricing Engine", dash:"Dashboard", __loading:"Computing…" }[screen]}
            </div>
            <Mono style={{ fontSize:11.5, color:t.textMuted, display:"block", marginTop:3 }}>
              Bengaluru · Guidewire DEVTrails 2026 Phase 1
            </Mono>
          </div>
          {hasCoverage && (
            <div style={{ display:"flex", alignItems:"center", gap:8, background:t.greenDim, border:`1px solid ${t.green}44`, borderRadius:20, padding:"7px 16px" }}>
              <div style={{ width:7, height:7, borderRadius:"50%", background:t.green, animation:"pulse 1.8s infinite" }} />
              <Mono style={{ fontSize:12, color:t.green, fontWeight:600 }}>COVERAGE ACTIVE · {fmt((obState.income || INCOME_OPTS[2]).cap)} CAP</Mono>
            </div>
          )}
        </div>

        {/* Screen content */}
        <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
          {screen === "onboard"   && <OnboardScreen t={t} onComplete={handleOnboardComplete} />}
          {screen === "__loading" && <PricingLoader t={t} />}
          {screen === "quote"     && <QuoteScreen t={t} obState={obState} onActivate={handleActivate} />}
          {screen === "dash"      && <DashScreen t={t} obState={obState} />}
        </div>

        {/* Mobile bottom nav */}
        {screen !== "__loading" && (
          <MobileBottomNav screen={screen} setScreen={setScreen} t={t} unlocked={unlocked} />
        )}
      </div>

      <Toast msg={toast} t={t} />
    </div>
  );
}
