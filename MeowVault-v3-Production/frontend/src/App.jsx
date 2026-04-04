import { useState, useEffect, useCallback } from "react";
const API = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ═══ THEME ════════════════════════════════════════════════════════════════ */
const TH={dark:{bg:"#060c14",sf:"#0b1420",cd:"#0f1c2a",cd2:"#132131",bd:"#1a2d42",tl:"#00d4b8",tlD:"#002e2a",tlM:"#00a894",am:"#f5a623",amD:"#2b1e06",gn:"#1ee676",gnD:"#042415",rd:"#ff5252",rdD:"#2a0808",bl:"#4da6ff",blD:"#051a33",tx:"#e4f0f6",txM:"#537a92",txD:"#2a4860"},light:{bg:"#eef4fa",sf:"#fff",cd:"#fff",cd2:"#f3f8fd",bd:"#d0e2f0",tl:"#00806e",tlD:"#d2eeea",tlM:"#009882",am:"#c07a08",amD:"#fef2d8",gn:"#0a8848",gnD:"#d4f4e4",rd:"#d03030",rdD:"#fce6e6",bl:"#1868c0",blD:"#dceeff",tx:"#0a1828",txM:"#5878a0",txD:"#a8c0d0"}};
const F={s:"'Syne',sans-serif",m:"'IBM Plex Mono',monospace",b:"'Lato',sans-serif"};
const ZONES=["HSR Layout","Koramangala","BTM Layout","Indiranagar","JP Nagar","Jayanagar","Bellandur","Sarjapur"];
const BRKTS=[{l:"₹3K–₹4K/wk",s:"~₹550/day",p:88,c:2800},{l:"₹4K–₹5.5K/wk",s:"~₹750/day",p:109,c:3500},{l:"₹5.5K–₹7K/wk",s:"~₹900/day",p:130,c:4200},{l:"₹7K–₹9K/wk",s:"~₹1,100/day",p:149,c:5100}];
const fmt=n=>"₹"+Number(n).toLocaleString("en-IN");

const injectCSS=t=>{let e=document.getElementById("mv");if(!e){e=document.createElement("style");e.id="mv";document.head.appendChild(e)}e.textContent=`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Lato:wght@300;400;700&display=swap');*{box-sizing:border-box;margin:0;padding:0}body{background:${t.bg};overflow-x:hidden}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${t.bd};border-radius:3px}input,select{font-family:inherit}@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}@keyframes pulse{0%,100%{transform:scale(1);opacity:.7}50%{transform:scale(1.8);opacity:0}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(0,212,184,.25)}50%{box-shadow:0 0 0 10px rgba(0,212,184,0)}}`;};

/* ═══ API ══════════════════════════════════════════════════════════════════ */
const api={
  token:null,
  async call(path,opts={}){try{const h={"Content-Type":"application/json",...opts.headers};if(this.token)h.Authorization=`Bearer ${this.token}`;const r=await fetch(`${API}${path}`,{...opts,headers:h});if(r.status===401){this.token=null;return null}return await r.json()}catch(e){console.warn(`API ${path} fallback`,e);return null}},
  signup:d=>api.call("/api/auth/signup",{method:"POST",body:JSON.stringify(d)}),
  signin:d=>api.call("/api/auth/signin",{method:"POST",body:JSON.stringify(d)}),
  signout:()=>api.call("/api/auth/signout",{method:"POST"}),
  me:()=>api.call("/api/auth/me"),
  weather:z=>api.call(`/api/weather/${encodeURIComponent(z)}`),
  aqi:z=>api.call(`/api/aqi/${encodeURIComponent(z)}`),
  platform:z=>api.call(`/api/platform-signal/${encodeURIComponent(z)}`),
  disruptions:()=>api.call("/api/disruption-signals"),
  lpg:()=>api.call("/api/lpg-index"),
  nlpRisk:()=>api.call("/api/nlp-risk"),
  pricing:d=>api.call("/api/pricing/compute",{method:"POST",body:JSON.stringify(d)}),
  activatePolicy:(rid,p)=>api.call(`/api/policies/activate?rider_id=${rid}&premium=${p}`,{method:"POST"}),
  activePolicy:rid=>api.call(`/api/policies/active/${rid}`),
  policyHistory:rid=>api.call(`/api/policies/history/${rid}`),
  cancelPolicy:pid=>api.call(`/api/policies/${pid}/cancel`,{method:"POST"}),
  toggleRenew:pid=>api.call(`/api/policies/${pid}/toggle-renew`,{method:"POST"}),
  triggerClaim:d=>api.call("/api/claims/trigger",{method:"POST",body:JSON.stringify(d)}),
  claims:rid=>api.call(`/api/claims/${rid}`),
  notifications:rid=>api.call(`/api/notifications/${rid}`),
  fraudCheck:d=>api.call("/api/fraud/check",{method:"POST",body:JSON.stringify(d)}),
  admin:()=>api.call("/api/admin/portfolio"),
  health:()=>api.call("/api/health"),
};

/* ═══ HOOKS ════════════════════════════════════════════════════════════════ */
const useAnim=(d=[])=>{const[v,set]=useState(false);useEffect(()=>{const t=setTimeout(()=>set(true),50);return()=>clearTimeout(t)},d);return v};
const useResp=()=>{const[w,set]=useState(typeof window!=="undefined"?window.innerWidth:1200);useEffect(()=>{const h=()=>set(window.innerWidth);window.addEventListener("resize",h);return()=>window.removeEventListener("resize",h)},[]);return{mob:w<768,desk:w>=1024}};

/* ═══ UI ATOMS ═════════════════════════════════════════════════════════════ */
const Inp=({t,...p})=>{const[f,set]=useState(false);return<input {...p} onFocus={()=>set(true)} onBlur={()=>set(false)} style={{width:"100%",padding:"12px 16px",background:t.cd2,border:`1px solid ${f?t.tl:t.bd}`,borderRadius:10,color:t.tx,fontSize:15,outline:"none",fontFamily:F.b,...p.style}}/>};
const Btn=({children,onClick,ghost,t,disabled,style:sx})=>{const[h,set]=useState(false);return<button onClick={onClick} disabled={disabled} onMouseEnter={()=>set(true)} onMouseLeave={()=>set(false)} style={{width:"100%",padding:"14px",border:ghost?`1px solid ${t.tl}`:"none",borderRadius:11,fontFamily:F.s,fontSize:15,fontWeight:700,cursor:disabled?"not-allowed":"pointer",background:ghost?(h?t.cd2:"transparent"):(disabled?t.tlD:h?t.tlM:t.tl),color:ghost?t.tl:(disabled?t.txM:"#fff"),boxShadow:!ghost&&!disabled?`0 2px 12px ${t.tl}33`:"none",transition:"all .2s",...sx}}>{children}</button>};
const Stat=({v,l,c,t})=><div style={{background:t.cd,border:`1px solid ${t.bd}`,borderRadius:12,padding:"14px",textAlign:"center"}}><div style={{fontFamily:F.m,fontSize:20,fontWeight:600,color:c||t.tl}}>{v}</div><div style={{fontSize:10,color:t.txM,marginTop:5,fontFamily:F.m,whiteSpace:"pre-line"}}>{l}</div></div>;
const Toast=({msg,t})=>msg?<div style={{position:"fixed",bottom:28,left:"50%",transform:"translateX(-50%)",background:t.cd,border:`1px solid ${t.tl}`,borderRadius:12,padding:"12px 24px",fontSize:14,color:t.tx,zIndex:999,fontFamily:F.b,boxShadow:`0 8px 32px rgba(0,0,0,.4)`}}>{msg}</div>:null;

/* ═══ AUTH SCREEN ══════════════════════════════════════════════════════════ */
function AuthScreen({t,onAuth,r}){
  const[mode,setMode]=useState("signin");
  const[name,setName]=useState("");
  const[phone,setPhone]=useState("");
  const[err,setErr]=useState("");
  const[loading,setLoading]=useState(false);
  const mw=r.desk?{maxWidth:420,margin:"0 auto"}:{};

  const handle=async()=>{
    setErr("");setLoading(true);
    if(mode==="signup"){
      if(!name||!phone){setErr("Name and phone required");setLoading(false);return}
      const res=await api.signup({name,phone,platform:"Swiggy"});
      if(res?.token){api.token=res.token;onAuth(res.user,"signup")}
      else setErr(res?.detail||"Signup failed");
    }else{
      if(!phone){setErr("Phone required");setLoading(false);return}
      const res=await api.signin({phone});
      if(res?.token){api.token=res.token;onAuth(res.user,"signin")}
      else setErr(res?.detail||"Phone not registered");
    }
    setLoading(false);
  };

  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,alignItems:"center",justifyContent:"center",padding:"40px 20px"}}>
      <div style={mw}>
        <div style={{textAlign:"center",marginBottom:32}}>
          <div style={{width:64,height:64,borderRadius:18,background:`linear-gradient(135deg,${t.tl},${t.tlM})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,margin:"0 auto 16px",boxShadow:`0 0 40px ${t.tl}33`}}>🐾</div>
          <div style={{fontFamily:F.s,fontWeight:800,fontSize:28,color:t.tx}}>MeowVault</div>
          <div style={{fontSize:14,color:t.txM,marginTop:8,fontFamily:F.b}}>Parametric income protection for delivery riders</div>
        </div>
        <div style={{display:"flex",gap:0,marginBottom:24,background:t.cd,borderRadius:10,border:`1px solid ${t.bd}`,overflow:"hidden"}}>
          {["signin","signup"].map(m=><button key={m} onClick={()=>{setMode(m);setErr("")}} style={{flex:1,padding:"11px",border:"none",background:mode===m?t.tl:"transparent",color:mode===m?"#fff":t.txM,fontFamily:F.m,fontSize:13,fontWeight:600,cursor:"pointer"}}>{m==="signin"?"Sign In":"Sign Up"}</button>)}
        </div>
        {mode==="signup"&&<div style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:600,color:t.txM,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6,fontFamily:F.m}}>Full name</div><Inp t={t} placeholder="Arjun Kumar" value={name} onChange={e=>setName(e.target.value)}/></div>}
        <div style={{marginBottom:14}}><div style={{fontSize:11,fontWeight:600,color:t.txM,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6,fontFamily:F.m}}>Phone number</div><Inp t={t} type="tel" placeholder="+91 98765 43210" value={phone} onChange={e=>setPhone(e.target.value)}/></div>
        {err&&<div style={{padding:"10px 14px",background:t.rdD,border:`1px solid ${t.rd}44`,borderRadius:10,fontSize:13,color:t.rd,fontFamily:F.b,marginBottom:14}}>{err}</div>}
        <Btn t={t} onClick={handle} disabled={loading}>{loading?"Processing…":mode==="signin"?"Sign In":"Create Account"}</Btn>
        {mode==="signin"&&<div style={{textAlign:"center",marginTop:16,fontSize:13,color:t.txM,fontFamily:F.b}}>Demo: use any phone number to sign up first</div>}
      </div>
    </div>
  );
}

/* ═══ ONBOARD (post-signup profile completion) ═════════════════════════════ */
function OnboardScreen({t,user,onComplete,r}){
  const[step,setStep]=useState(0);
  const[zones,setZones]=useState(user.zones||[]);
  const[bracket,setBracket]=useState(user.income_bracket||2);
  const[aadhaar,setAadhaar]=useState(user.aadhaar_last4||"");
  const[upi,setUpi]=useState(user.upi_id||"");
  const mw=r.desk?{maxWidth:560,margin:"0 auto"}:{};
  const vis=useAnim([step]);
  const toggleZ=z=>setZones(zs=>zs.includes(z)?zs.filter(x=>x!==z):zs.length<4?[...zs,z]:zs);
  const titles=[["Complete your profile","Aadhaar verification + delivery zones"],["Income & payout","Sets your coverage cap and UPI payout"]];
  const canNext=[zones.length>=1&&aadhaar.length===4, upi.length>=5];

  const steps=[
    <>
      <div style={{marginBottom:18}}><div style={{fontSize:11,fontWeight:600,color:t.txM,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6,fontFamily:F.m}}>Aadhaar last 4 digits</div><Inp t={t} maxLength={4} placeholder="XXXX" value={aadhaar} onChange={e=>setAadhaar(e.target.value.replace(/\D/g,"").slice(0,4))}/><div style={{fontSize:11,color:t.txM,marginTop:5,fontFamily:F.m}}>Mock UIDAI verification</div></div>
      <div style={{fontSize:11,fontWeight:600,color:t.txM,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8,fontFamily:F.m}}>Active delivery zones (max 4)</div>
      <div style={{display:"grid",gridTemplateColumns:r.desk?"1fr 1fr 1fr 1fr":"1fr 1fr",gap:8}}>
        {ZONES.map(z=><div key={z} onClick={()=>toggleZ(z)} style={{padding:"10px 12px",border:`1px solid ${zones.includes(z)?t.tl:t.bd}`,borderRadius:10,fontSize:13,cursor:"pointer",textAlign:"center",background:zones.includes(z)?t.tlD:t.cd2,color:zones.includes(z)?t.tl:t.txM,fontFamily:F.b,fontWeight:zones.includes(z)?600:400}}>{z}</div>)}
      </div>
      {zones.length>0&&<div style={{marginTop:12,padding:"10px 14px",background:t.tlD,borderRadius:10,fontSize:12,color:t.tl,fontFamily:F.m}}>{zones.length}/4 zones · {zones.join(" · ")}</div>}
    </>,
    <>
      <div style={{fontSize:11,fontWeight:600,color:t.txM,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8,fontFamily:F.m}}>Weekly income bracket</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:18}}>
        {BRKTS.map((b,i)=><div key={i} onClick={()=>setBracket(i)} style={{padding:"14px 12px",border:`1px solid ${bracket===i?t.tl:t.bd}`,borderRadius:10,cursor:"pointer",background:bracket===i?t.tlD:t.cd2,textAlign:"center"}}><div style={{fontSize:14,fontWeight:700,color:bracket===i?t.tl:t.tx,fontFamily:F.s}}>{b.l}</div><div style={{fontSize:11,color:bracket===i?t.tl+"99":t.txM,marginTop:4,fontFamily:F.m}}>{b.s} · cap {fmt(b.c)}</div></div>)}
      </div>
      <div style={{fontSize:11,fontWeight:600,color:t.txM,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6,fontFamily:F.m}}>UPI ID for payouts</div>
      <Inp t={t} placeholder="yourname@gpay" value={upi} onChange={e=>setUpi(e.target.value)}/>
    </>
  ];

  return(
    <div style={{display:"flex",flexDirection:"column",flex:1,overflow:"hidden"}}>
      <div style={{background:t.sf,padding:r.desk?"28px 40px":"22px 20px",borderBottom:`1px solid ${t.bd}`}}><div style={mw}><div style={{fontSize:11,color:t.tl,fontFamily:F.m,letterSpacing:".1em",marginBottom:6,textTransform:"uppercase"}}>Step {step+1} of 2</div><div style={{fontFamily:F.s,fontWeight:800,fontSize:r.desk?26:20,color:t.tx}}>{titles[step][0]}</div><div style={{fontSize:14,color:t.txM,marginTop:5,fontFamily:F.b}}>{titles[step][1]}</div></div></div>
      <div style={{flex:1,overflowY:"auto",padding:r.desk?"28px 40px":"20px",animation:vis?"fadeUp .35s ease":"none"}}><div style={mw}>{steps[step]}</div></div>
      <div style={{padding:r.desk?"16px 40px":"14px 20px",background:t.sf,borderTop:`1px solid ${t.bd}`}}><div style={{...mw,display:"flex",gap:10}}>
        {step>0&&<Btn ghost t={t} onClick={()=>setStep(0)} style={{width:"auto",padding:"14px 20px",flex:"0 0 auto"}}>← Back</Btn>}
        <Btn t={t} disabled={!canNext[step]} onClick={()=>{if(step<1)setStep(1);else onComplete({zones,income_bracket:bracket,aadhaar_last4:aadhaar,upi_id:upi})}}>{step<1?"Continue →":"⚡ Run AI Pricing Engine"}</Btn>
      </div></div>
    </div>
  );
}

/* ═══ PRICING ENGINE ═══════════════════════════════════════════════════════ */
const STAGES=["Fetching Open-Meteo weather forecast…","Scanning CPCB AQI index…","Polling LPG supply disruption index…","Running NLP disruption classifier (Ollama)…","Checking civic advisories (Section 144)…","Evaluating platform order density…","Computing zone historical risk…","Running XGBoost pricing model…","Applying loyalty & seasonal adjustments…","Generating personalised quote ✓"];

function EngineScreen({t,onDone,user,r}){
  const[stage,setStage]=useState(0);
  const[score,setScore]=useState(0);
  const[live,setLive]=useState([]);
  useEffect(()=>{let i=0;const run=async()=>{if(i>=STAGES.length){setTimeout(onDone,400);return}i++;setStage(i);setScore(Math.min(76,Math.round(i/STAGES.length*76)));if(i===1&&user.zones?.[0]){const d=await api.weather(user.zones[0]);if(d)setLive(l=>[...l,"weather"])}if(i===3){const d=await api.lpg();if(d)setLive(l=>[...l,"lpg"])}if(i===4){const d=await api.nlpRisk();if(d)setLive(l=>[...l,"nlp"])}if(i===6&&user.zones?.[0]){const d=await api.platform(user.zones[0]);if(d)setLive(l=>[...l,"platform"])}setTimeout(run,350)};run()},[]);
  const pct=Math.round(stage/STAGES.length*100);
  return(
    <div style={{display:"flex",flexDirection:r.desk?"row":"column",flex:1,alignItems:"center",justifyContent:"center",padding:r.desk?"48px":"32px 28px",gap:r.desk?60:28}}>
      <div style={{position:"relative",width:140,height:140,flexShrink:0}}><svg width={140} height={140} style={{position:"absolute",transform:"rotate(-90deg)"}}><circle cx={70} cy={70} r={58} fill="none" stroke={t.bd} strokeWidth={7}/><circle cx={70} cy={70} r={58} fill="none" stroke={t.tl} strokeWidth={7} strokeDasharray={`${2*Math.PI*58}`} strokeDashoffset={`${2*Math.PI*58*(1-pct/100)}`} strokeLinecap="round" style={{transition:"stroke-dashoffset .4s"}}/></svg><div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{fontFamily:F.m,fontSize:32,fontWeight:600,color:t.tl}}>{score}</div><div style={{fontSize:11,color:t.txM,fontFamily:F.m}}>/100</div></div></div>
      <div style={{width:"100%",maxWidth:420}}><div style={{fontFamily:F.s,fontWeight:700,fontSize:20,color:t.tx,textAlign:r.desk?"left":"center",marginBottom:20}}>AI Pricing Engine</div><div style={{display:"flex",flexDirection:"column",gap:7}}>{STAGES.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,opacity:i<stage?1:i===stage?0.6:0.2}}><div style={{width:18,height:18,borderRadius:"50%",flexShrink:0,background:i<stage?t.tl:i===stage?"transparent":t.txD,border:i===stage?`2px solid ${t.tl}`:"none",display:"flex",alignItems:"center",justifyContent:"center"}}>{i<stage&&<span style={{fontSize:10,color:t.bg}}>✓</span>}{i===stage&&<div style={{width:6,height:6,borderRadius:"50%",background:t.tl,animation:"spin .6s linear infinite"}}/>}</div><span style={{fontSize:13,color:i<stage?t.tl:i===stage?t.tx:t.txM,fontFamily:F.b}}>{s}</span></div>)}</div>{live.length>0&&<div style={{marginTop:16,padding:"10px 14px",background:t.tlD,border:`1px solid ${t.tl}33`,borderRadius:10,fontSize:11,fontFamily:F.m,color:t.tl}}>✓ Live API data: {live.join(", ")}</div>}</div>
    </div>
  );
}

/* ═══ QUOTE ═════════════════════════════════════════════════════════════════ */
function QuoteScreen({t,pricing,onActivate,r}){
  const vis=useAnim();const p=pricing||{};const score=p.risk_score||76;const premium=p.premium||130;const cap=p.cap||4200;
  const colMap={red:t.rd,amber:t.am,blue:t.bl,green:t.gn};const mw=r.desk?{maxWidth:700,margin:"0 auto"}:{};
  return(
    <div style={{flex:1,overflowY:"auto",paddingBottom:12}}>
      <div style={{background:t.sf,padding:r.desk?"24px 40px":"18px 20px",borderBottom:`1px solid ${t.bd}`,animation:vis?"fadeUp .3s":"none"}}><div style={mw}><div style={{fontFamily:F.s,fontWeight:800,fontSize:r.desk?26:20,color:t.tx}}>Your AI quote</div><div style={{fontSize:12,color:t.txM,fontFamily:F.m,marginTop:5}}>Week of {new Date().toLocaleDateString("en-IN",{month:"short",day:"numeric"})} · {p.model||"XGBoost GBM"}</div></div></div>
      <div style={{padding:r.desk?"20px 40px":"14px 16px"}}><div style={mw}>
        <div style={{padding:"14px 16px",background:t.rdD,border:`1px solid ${t.rd}44`,borderRadius:12,marginBottom:16,fontSize:13,color:t.tx,fontFamily:F.b,lineHeight:1.6}}>⚠️ <strong style={{color:t.rd}}>Active disruptions:</strong> LPG supply crisis affecting restaurant operations across Bengaluru. Platform order density significantly below normal levels.</div>
        <div style={{background:t.cd,border:`1px solid ${t.bd}`,borderRadius:14,overflow:"hidden",marginBottom:16}}>
          <div style={{padding:"14px 18px",borderBottom:`1px solid ${t.bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:t.cd2}}><div style={{fontSize:12,color:t.txM,fontFamily:F.m,textTransform:"uppercase",letterSpacing:".07em"}}>Weekly premium</div><div style={{fontSize:11,fontFamily:F.m,fontWeight:600,padding:"4px 12px",borderRadius:20,background:score>70?t.rdD:score>50?t.amD:t.gnD,color:score>70?t.rd:score>50?t.am:t.gn}}>RISK {score}/100</div></div>
          <div style={{padding:"22px 18px",display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}><div><div style={{fontFamily:F.m,fontWeight:600,fontSize:r.desk?52:42,color:t.tl,lineHeight:1}}>{fmt(premium)}</div><div style={{fontSize:13,color:t.txM,marginTop:6,fontFamily:F.b}}>per week · auto-renews Monday</div></div><div style={{textAlign:"right"}}><div style={{fontSize:10,color:t.txM,fontFamily:F.m,textTransform:"uppercase"}}>Coverage cap</div><div style={{fontFamily:F.m,fontSize:24,fontWeight:600,color:t.tx,marginTop:4}}>{fmt(cap)}</div></div></div>
          <div style={{height:1,background:t.bd,margin:"0 18px"}}/>
          <div style={{padding:"16px 18px"}}><div style={{fontSize:10,color:t.txM,fontFamily:F.m,textTransform:"uppercase",letterSpacing:".07em",marginBottom:14}}>Signal breakdown</div>{(p.breakdown||[]).map((s,i)=>{const[mt,setMt]=useState(false);useEffect(()=>{setTimeout(()=>setMt(true),i*80+100)},[]);return<div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}><div style={{flex:1,fontSize:13,color:t.tx,fontFamily:F.b}}>{s.label}</div><div style={{width:100,height:5,background:t.bd,borderRadius:3,overflow:"hidden"}}><div style={{height:5,borderRadius:3,background:colMap[s.color]||t.am,width:mt?`${Math.min(100,Math.abs(s.pts)/22*100)}%`:"0%",transition:"width 1s ease"}}/></div><div style={{width:35,textAlign:"right",fontSize:12,fontFamily:F.m,color:colMap[s.color]||t.am}}>{s.pts>=0?"+":""}{Math.round(s.pts)}</div></div>})}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}><Stat v={fmt(p.normal_premium||49)} l="Normal week" c={t.gn} t={t}/><Stat v={fmt(premium)} l="This week" c={t.rd} t={t}/><Stat v={`+${score-28}pts`} l="Risk delta" c={t.am} t={t}/></div>
        <Btn t={t} onClick={onActivate} style={{fontSize:16,padding:16,marginBottom:8}}>Activate Coverage · Pay {fmt(premium)} via UPI</Btn>
        <div style={{textAlign:"center",fontSize:12,color:t.txM,fontFamily:F.b}}>🔒 Razorpay sandbox · Auto-renews Mon 05:00 AM IST</div>
      </div></div>
    </div>
  );
}

/* ═══ DASHBOARD ═════════════════════════════════════════════════════════════ */
function DashScreen({t,user,r,showToast}){
  const vis=useAnim();const[policy,setPolicy]=useState(null);const[claims,setClaims]=useState([]);const[weather,setWeather]=useState(null);const[lpg,setLpg]=useState(null);const[notifs,setNotifs]=useState([]);const[trigLoading,setTrigLoading]=useState(false);const[showPolicy,setShowPolicy]=useState(false);
  const b=BRKTS[user.income_bracket||2];const mw=r.desk?{maxWidth:900,margin:"0 auto"}:{};

  const reload=async()=>{
    const[pol,cl,w,l,n]=await Promise.all([api.activePolicy(user.id),api.claims(user.id),user.zones?.[0]?api.weather(user.zones[0]):null,api.lpg(),api.notifications(user.id)]);
    if(pol?.policy)setPolicy(pol.policy);if(cl?.claims)setClaims(cl.claims);if(w)setWeather(w);if(l)setLpg(l);if(n?.notifications)setNotifs(n.notifications);
  };
  useEffect(()=>{reload();const iv=setInterval(reload,30000);return()=>clearInterval(iv)},[]);

  const simulateDisruption=async(type,zone)=>{
    setTrigLoading(true);
    const res=await api.triggerClaim({rider_id:user.id,trigger_type:type,zone:zone||user.zones?.[0]||"HSR Layout"});
    if(res?.claim){showToast(`🐾 ${res.notification?.body||"Payout processed!"}`);await reload()}
    setTrigLoading(false);
  };

  const totalPaid=claims.filter(c=>c.status==="paid").reduce((a,c)=>a+c.payout,0);

  return(
    <div style={{flex:1,overflowY:"auto",paddingBottom:12}}>
      {/* Header */}
      <div style={{background:t.sf,padding:r.desk?"20px 40px":"16px 20px",borderBottom:`1px solid ${t.bd}`}}><div style={mw}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}><div style={{width:48,height:48,borderRadius:14,background:`linear-gradient(135deg,${t.tl}44,${t.tlM}22)`,border:`2px solid ${t.tl}55`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F.s,fontWeight:800,fontSize:16,color:t.tl}}>{user.name?.[0]||"A"}{user.name?.split(" ")[1]?.[0]||"K"}</div><div><div style={{fontFamily:F.s,fontWeight:700,fontSize:18,color:t.tx}}>{user.name||"Rider"}</div><div style={{fontSize:12,color:t.txM,fontFamily:F.m}}>{user.platform} · {user.partner_id}</div></div></div>
        {policy&&<div style={{background:t.cd2,border:`1px solid ${t.gnD}`,borderRadius:12,padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",animation:"glow 3s ease infinite",cursor:"pointer"}} onClick={()=>setShowPolicy(!showPolicy)}><div style={{display:"flex",alignItems:"center",gap:10}}><div style={{position:"relative",width:11,height:11}}><div style={{position:"absolute",inset:0,borderRadius:"50%",background:t.gn}}/><div style={{position:"absolute",inset:-3,borderRadius:"50%",border:`1px solid ${t.gn}`,animation:"pulse 1.8s infinite"}}/></div><div><div style={{fontSize:14,fontWeight:600,color:t.tx,fontFamily:F.s}}>Coverage Active</div><div style={{fontSize:11,color:t.txM,fontFamily:F.m}}>Tap to view policy details</div></div></div><div style={{fontSize:13,color:t.gn,fontFamily:F.m,fontWeight:600}}>Cap {fmt(policy.cap)}</div></div>}
      </div></div>

      <div style={{padding:r.desk?"20px 40px":"14px 16px"}}><div style={mw}>
        {/* Policy details panel */}
        {showPolicy&&policy&&<div style={{marginBottom:16,background:t.cd,border:`1px solid ${t.bd}`,borderRadius:14,padding:"18px",animation:"fadeUp .3s ease"}}>
          <div style={{fontSize:10,color:t.txM,fontFamily:F.m,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Policy details</div>
          {[["Policy number",policy.id],["Premium paid",fmt(policy.premium)],["Coverage cap",fmt(policy.cap)],["Start",new Date(policy.start).toLocaleDateString("en-IN",{dateStyle:"medium"})],["End",new Date(policy.end).toLocaleDateString("en-IN",{dateStyle:"medium"})],["Claims used",`${policy.claims_used} (${fmt(policy.payout_total)} paid out)`],["Auto-renew",policy.auto_renew?"Enabled":"Disabled"]].map(([k,v],i)=><div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<6?`1px solid ${t.bd}`:"none"}}><span style={{fontSize:13,color:t.txM,fontFamily:F.m}}>{k}</span><span style={{fontSize:13,color:t.tx,fontFamily:F.m,fontWeight:500}}>{v}</span></div>)}
          <div style={{display:"flex",gap:8,marginTop:14}}>
            <button onClick={async()=>{await api.toggleRenew(policy.id);await reload()}} style={{flex:1,padding:"10px",border:`1px solid ${t.am}`,borderRadius:10,background:"transparent",color:t.am,fontFamily:F.m,fontSize:12,fontWeight:600,cursor:"pointer"}}>{policy.auto_renew?"Pause auto-renew":"Enable auto-renew"}</button>
            <button onClick={async()=>{if(confirm("Cancel coverage? Remaining days will not be refunded.")){await api.cancelPolicy(policy.id);await reload();setShowPolicy(false)}}} style={{flex:1,padding:"10px",border:`1px solid ${t.rd}`,borderRadius:10,background:"transparent",color:t.rd,fontFamily:F.m,fontSize:12,fontWeight:600,cursor:"pointer"}}>Cancel policy</button>
          </div>
        </div>}

        {/* Notifications */}
        {notifs.length>0&&<div style={{marginBottom:16}}>{notifs.slice(0,2).map((n,i)=><div key={i} style={{padding:"12px 14px",background:t.tlD,border:`1px solid ${t.tl}33`,borderRadius:10,marginBottom:6,fontSize:13,color:t.tx,fontFamily:F.b}}>🐾 {n.body}</div>)}</div>}

        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:r.desk?"1fr 1fr 1fr 1fr":"1fr 1fr",gap:10,marginBottom:20}}>
          <Stat v={String(claims.length)} l={"Claims\nprocessed"} t={t}/>
          <Stat v={fmt(totalPaid)} l={"Total\npaid out"} t={t}/>
          <Stat v={fmt((policy?.cap||b.c)-totalPaid)} l={"Cap\nremaining"} t={t}/>
          {r.desk&&<Stat v={claims.filter(c=>c.decision==="auto_approved").length.toString()} l={"Auto-approved\nzero friction"} c={t.gn} t={t}/>}
        </div>

        {/* LPG disruption */}
        {lpg&&<div style={{marginBottom:20,padding:"14px 16px",background:t.rdD,border:`1px solid ${t.rd}33`,borderRadius:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><div style={{fontSize:10,color:t.rd,fontFamily:F.m,textTransform:"uppercase",letterSpacing:".08em"}}>LPG supply disruption</div><div style={{fontSize:11,fontFamily:F.m,fontWeight:600,color:t.rd,padding:"2px 8px",background:t.rdD,borderRadius:8,border:`1px solid ${t.rd}44`}}>{lpg.severity}</div></div>
          <div style={{fontSize:20,fontWeight:700,fontFamily:F.m,color:t.rd}}>{lpg.supply_pct}% supply</div>
          <div style={{fontSize:12,color:t.tx,marginTop:5,fontFamily:F.b,lineHeight:1.5}}>{lpg.headline}</div>
          <div style={{fontSize:11,color:t.txM,marginTop:3,fontFamily:F.m}}>{lpg.source}</div>
        </div>}

        {/* Weather */}
        {weather&&<div style={{marginBottom:20,padding:"14px 16px",background:t.blD,border:`1px solid ${t.bl}33`,borderRadius:12}}>
          <div style={{fontSize:10,color:t.bl,fontFamily:F.m,textTransform:"uppercase",letterSpacing:".08em",marginBottom:8}}>Live weather · {weather.zone} · {weather.source}</div>
          <div style={{display:"flex",gap:8,overflowX:"auto"}}>{(weather.forecast||[]).slice(0,r.desk?7:5).map((d,i)=><div key={i} style={{minWidth:75,padding:"8px 10px",background:t.cd,borderRadius:8,textAlign:"center",flexShrink:0}}><div style={{fontSize:10,color:t.txM,fontFamily:F.m}}>{d.date?.slice(5)}</div><div style={{fontSize:14,fontWeight:600,color:d.rain_mm>15?t.rd:t.tx,fontFamily:F.m,marginTop:4}}>{d.rain_mm}mm</div><div style={{fontSize:10,color:t.txM,fontFamily:F.m,marginTop:2}}>{d.temp_max}°C</div></div>)}</div>
        </div>}

        {/* SIMULATE DISRUPTION — the demo killer feature */}
        <div style={{fontSize:10,color:t.txM,fontFamily:F.m,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Simulate disruption (live demo)</div>
        <div style={{display:"grid",gridTemplateColumns:r.desk?"1fr 1fr 1fr":"1fr 1fr",gap:8,marginBottom:20}}>
          {[
            {type:"lpg_crisis",label:"LPG Crisis",icon:"🔥",desc:"Restaurant shutdown"},
            {type:"heavy_rain",label:"Heavy Rain",icon:"🌧️",desc:"Flood alert"},
            {type:"platform_suppression",label:"Order Drop",icon:"📉",desc:"Algorithm shift"},
            {type:"extreme_heat",label:"Heat Wave",icon:"☀️",desc:"Outdoor advisory"},
          ].map(d=><button key={d.type} disabled={trigLoading} onClick={()=>simulateDisruption(d.type,user.zones?.[0]||"HSR Layout")} style={{padding:"14px",background:t.cd,border:`1px solid ${t.bd}`,borderRadius:12,cursor:trigLoading?"wait":"pointer",textAlign:"left"}}>
            <div style={{fontSize:18}}>{d.icon}</div>
            <div style={{fontSize:13,fontWeight:700,color:t.tx,fontFamily:F.s,marginTop:6}}>{d.label}</div>
            <div style={{fontSize:11,color:t.txM,fontFamily:F.b,marginTop:3}}>{d.desc}</div>
          </button>)}
        </div>
        {trigLoading&&<div style={{textAlign:"center",marginBottom:16}}><div style={{width:24,height:24,border:`3px solid ${t.tl}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .6s linear infinite",margin:"0 auto"}}/><div style={{fontSize:12,color:t.txM,fontFamily:F.m,marginTop:8}}>Evaluating trigger → fraud check → payout…</div></div>}

        {/* Claims history */}
        <div style={{fontSize:10,color:t.txM,fontFamily:F.m,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Claims history · {claims.length} total</div>
        {claims.length===0&&<div style={{padding:"20px",background:t.cd,border:`1px solid ${t.bd}`,borderRadius:12,textAlign:"center",color:t.txM,fontSize:13,fontFamily:F.b,marginBottom:16}}>No claims yet. Simulate a disruption above to see the auto-claim pipeline in action.</div>}
        <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
          {claims.slice(0,10).map((c,i)=><ClaimRow key={i} c={c} t={t}/>)}
        </div>
      </div></div>
    </div>
  );
}

function ClaimRow({c,t}){
  const[exp,setExp]=useState(false);
  return(
    <div style={{background:t.cd,border:`1px solid ${t.bd}`,borderRadius:12,overflow:"hidden",cursor:"pointer"}} onClick={()=>setExp(!exp)}>
      <div style={{padding:"13px 16px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div><div style={{fontSize:14,fontWeight:600,color:t.tx,fontFamily:F.b}}>{c.trigger?.replace(/_/g," ").replace(/\b\w/g,l=>l.toUpperCase())}</div><div style={{fontSize:11,color:t.txM,marginTop:3,fontFamily:F.m}}>{c.zone} · {new Date(c.created_at).toLocaleDateString("en-IN",{dateStyle:"medium"})}</div></div>
        <div style={{textAlign:"right"}}><div style={{fontSize:16,fontWeight:700,fontFamily:F.m,color:c.status==="paid"?t.gn:t.am}}>{fmt(c.payout)}</div><div style={{fontSize:10,color:c.status==="paid"?t.gn:t.am,fontFamily:F.m,marginTop:2}}>{c.status==="paid"?"✓ UPI sent":"⧖ "+c.status}</div></div>
      </div>
      {exp&&<div style={{padding:"10px 16px",borderTop:`1px solid ${t.bd}`,background:t.cd2,fontSize:12,color:t.txM,fontFamily:F.m}}>Threshold: {c.threshold} · Fraud score: {c.fraud_score} ({c.decision}) · Claim ID: {c.id}</div>}
    </div>
  );
}

/* ═══ FRAUD SCREEN ═════════════════════════════════════════════════════════ */
function FraudScreen({t,r}){
  const[scenario,setScenario]=useState("genuine");const[result,setResult]=useState(null);const[loading,setLoading]=useState(false);
  const mw=r.desk?{maxWidth:800,margin:"0 auto"}:{};
  const scenarios={genuine:{label:"Genuine stranded rider",desc:"Arjun stuck in HSR Layout rain. GPS matches, normal signals.",color:t.gn},spoofer:{label:"GPS spoofer at home",desc:"Fake rider in Whitefield spoofing GPS to HSR Layout.",color:t.rd},ring:{label:"Coordinated fraud ring",desc:"47 riders trigger simultaneous claims via Telegram group.",color:t.am}};

  const run=async k=>{setScenario(k);setLoading(true);const r=await api.fraudCheck({rider_id:"demo",claim_id:`CLM-${k}`,scenario:k});setResult(r);setLoading(false)};
  useEffect(()=>{run("genuine")},[]);

  return(
    <div style={{flex:1,overflowY:"auto",paddingBottom:12}}>
      <div style={{background:t.sf,padding:r.desk?"24px 40px":"18px 20px",borderBottom:`1px solid ${t.bd}`}}><div style={mw}><div style={{fontFamily:F.s,fontWeight:800,fontSize:r.desk?26:20,color:t.tx}}>Fraud & anti-spoofing engine</div><div style={{fontSize:13,color:t.txM,marginTop:6,fontFamily:F.b}}>Isolation Forest + GPS cross-check + duplicate detection. Click a scenario to see it work.</div></div></div>
      <div style={{padding:r.desk?"20px 40px":"14px 16px"}}><div style={mw}>
        {/* Scenarios */}
        <div style={{display:"grid",gridTemplateColumns:r.desk?"1fr 1fr 1fr":"1fr",gap:8,marginBottom:20}}>
          {Object.entries(scenarios).map(([k,s])=><div key={k} onClick={()=>!loading&&run(k)} style={{padding:"14px 16px",background:scenario===k?s.color+"15":t.cd,border:`2px solid ${scenario===k?s.color:t.bd}`,borderRadius:12,cursor:loading?"wait":"pointer"}}><div style={{fontSize:14,fontWeight:700,color:scenario===k?s.color:t.tx,fontFamily:F.s}}>{s.label}</div><div style={{fontSize:12,color:t.txM,marginTop:5,fontFamily:F.b,lineHeight:1.5}}>{s.desc}</div></div>)}
        </div>

        {/* Three-tier reference */}
        <div style={{display:"grid",gridTemplateColumns:r.desk?"1fr 1fr 1fr":"1fr",gap:8,marginBottom:20}}>
          {[{r:"< 30",l:"AUTO-APPROVE",d:"Instant UPI payout",c:t.gn,bg:t.gnD,a:result?.fraud_score<30},{r:"30–60",l:"SOFT HOLD",d:"2-hour silent verification",c:t.am,bg:t.amD,a:result?.fraud_score>=30&&result?.fraud_score<60},{r:"> 60",l:"MANUAL REVIEW",d:"Optional video evidence",c:t.rd,bg:t.rdD,a:result?.fraud_score>=60}].map((x,i)=><div key={i} style={{padding:"12px 14px",background:x.a?x.bg:t.cd,border:`2px solid ${x.a?x.c:t.bd}`,borderRadius:12}}><div style={{fontSize:12,fontFamily:F.m,color:x.c,fontWeight:600}}>{x.r}</div><div style={{fontSize:13,fontWeight:700,color:x.a?x.c:t.txM,fontFamily:F.s,marginTop:3}}>{x.l}</div><div style={{fontSize:11,color:t.txM,fontFamily:F.b,marginTop:2}}>{x.d}</div></div>)}
        </div>

        {loading&&<div style={{textAlign:"center",padding:"30px"}}><div style={{width:24,height:24,border:`3px solid ${t.tl}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .6s linear infinite",margin:"0 auto"}}/></div>}

        {result&&!loading&&<div style={{padding:"20px",background:result.fraud_score<30?t.gnD:result.fraud_score<60?t.amD:t.rdD,border:`2px solid ${result.fraud_score<30?t.gn:result.fraud_score<60?t.am:t.rd}66`,borderRadius:14,marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div><div style={{fontSize:18,fontWeight:800,fontFamily:F.s,color:result.fraud_score<30?t.gn:result.fraud_score<60?t.am:t.rd}}>{result.decision?.replace(/_/g," ")}</div><div style={{fontSize:13,color:t.tx,fontFamily:F.b,marginTop:5}}>{result.action}</div></div><div style={{textAlign:"center"}}><div style={{fontFamily:F.m,fontSize:36,fontWeight:700,color:result.fraud_score<30?t.gn:result.fraud_score<60?t.am:t.rd}}>{result.fraud_score}</div><div style={{fontSize:10,color:t.txM,fontFamily:F.m}}>/100</div></div></div>
          {result.gps_check&&<div style={{padding:"12px 14px",background:t.cd,borderRadius:10,marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600,color:t.tx,fontFamily:F.b}}>GPS cross-check</span><span style={{fontSize:11,fontFamily:F.m,fontWeight:600,color:result.gps_check.status==="PASS"?t.gn:t.rd}}>{result.gps_check.status} · {result.gps_check.distance_km}km</span></div><div style={{fontSize:12,color:t.txM,fontFamily:F.m,marginTop:5}}>{result.gps_check.detail}</div></div>}
          {result.duplicate_check&&<div style={{padding:"12px 14px",background:t.cd,borderRadius:10,marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:600,color:t.tx,fontFamily:F.b}}>Ring / duplicate detection</span><span style={{fontSize:11,fontFamily:F.m,fontWeight:600,color:result.duplicate_check.status==="PASS"?t.gn:t.rd}}>{result.duplicate_check.status}</span></div><div style={{fontSize:12,color:t.txM,fontFamily:F.m,marginTop:5}}>{result.duplicate_check.detail}</div></div>}
          {result.signal_checks&&<div style={{display:"grid",gridTemplateColumns:r.desk?"1fr 1fr 1fr":"1fr 1fr",gap:6}}>{result.signal_checks.map((s,i)=><div key={i} style={{padding:"10px 12px",background:t.cd,borderRadius:10}}><div style={{fontSize:11,color:t.txM,fontFamily:F.m}}>{s.signal.replace(/_/g," ")}</div><div style={{display:"flex",justifyContent:"space-between",marginTop:5}}><span style={{fontSize:13,fontWeight:600,color:s.status==="PASS"?t.gn:t.rd,fontFamily:F.m}}>{s.status}</span><span style={{fontSize:11,color:t.txM,fontFamily:F.m}}>{s.score}/{s.max}</span></div><div style={{marginTop:5,height:4,background:t.bd,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${(s.score/s.max)*100}%`,background:s.status==="PASS"?t.gn:t.rd,borderRadius:2}}/></div></div>)}</div>}
        </div>}
      </div></div>
    </div>
  );
}

/* ═══ ADMIN ═════════════════════════════════════════════════════════════════ */
function AdminScreen({t,r}){
  const[data,setData]=useState(null);useEffect(()=>{api.admin().then(d=>d&&setData(d))},[]);
  const p=data||{active_policies:1247,premium_collected:480000,predicted_claims_next_week:340,payouts:320000,loss_ratio:66.7,fraud_blocked:12,fraud_savings:48000,predicted_payout:240000,zones:[]};
  const mw=r.desk?{maxWidth:1000,margin:"0 auto"}:{};
  return(
    <div style={{flex:1,overflowY:"auto",paddingBottom:12}}>
      <div style={{background:t.sf,padding:r.desk?"24px 40px":"18px 20px",borderBottom:`1px solid ${t.bd}`}}><div style={mw}><div style={{fontFamily:F.s,fontWeight:800,fontSize:r.desk?26:20,color:t.tx}}>Insurer admin dashboard</div><div style={{fontSize:13,color:t.txM,marginTop:6,fontFamily:F.b}}>Portfolio overview · predictive forecasting · zone analytics</div></div></div>
      <div style={{padding:r.desk?"20px 40px":"14px 16px"}}><div style={mw}>
        <div style={{display:"grid",gridTemplateColumns:r.desk?"1fr 1fr 1fr 1fr":"1fr 1fr",gap:10,marginBottom:20}}><Stat v={p.active_policies?.toLocaleString()} l="Active policies" c={t.tl} t={t}/><Stat v={fmt(p.premium_collected)} l={"Premium\ncollected"} c={t.gn} t={t}/><Stat v={String(p.predicted_claims_next_week)} l={"Predicted claims\nnext week"} c={t.am} t={t}/><Stat v={fmt(p.predicted_payout)} l={"Est. payout\nnext week"} c={t.rd} t={t}/></div>
        <div style={{background:t.cd,border:`1px solid ${t.bd}`,borderRadius:14,padding:"18px",marginBottom:20}}><div style={{fontSize:10,color:t.txM,fontFamily:F.m,textTransform:"uppercase",letterSpacing:".08em",marginBottom:12}}>Loss ratio</div><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,color:t.txM,fontFamily:F.m}}>Claims paid</span><span style={{fontSize:13,color:t.rd,fontFamily:F.m,fontWeight:600}}>{fmt(p.payouts)}</span></div><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:13,color:t.txM,fontFamily:F.m}}>Premium collected</span><span style={{fontSize:13,color:t.gn,fontFamily:F.m,fontWeight:600}}>{fmt(p.premium_collected)}</span></div><div style={{height:1,background:t.bd,margin:"8px 0"}}/><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:14,fontWeight:700,color:t.tx,fontFamily:F.s}}>Loss ratio</span><span style={{fontSize:18,fontWeight:700,color:t.am,fontFamily:F.m}}>{p.loss_ratio}%</span></div><div style={{marginTop:10,height:8,background:t.bd,borderRadius:4,overflow:"hidden"}}><div style={{height:"100%",width:`${p.loss_ratio}%`,background:`linear-gradient(90deg,${t.gn},${t.am},${t.rd})`,borderRadius:4}}/></div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}><Stat v={String(p.fraud_blocked)} l={"Fraud claims\nblocked"} c={t.rd} t={t}/><Stat v={fmt(p.fraud_savings)} l={"Fraud savings\nthis week"} c={t.gn} t={t}/></div>
        <div style={{fontSize:10,color:t.txM,fontFamily:F.m,textTransform:"uppercase",letterSpacing:".08em",marginBottom:10}}>Zone risk heatmap · Bengaluru</div>
        <div style={{display:"grid",gridTemplateColumns:r.desk?"1fr 1fr 1fr 1fr":"1fr 1fr",gap:8,marginBottom:20}}>{(p.zones||[]).sort((a,b)=>b.risk-a.risk).map(z=>{const c=z.risk>70?t.rd:z.risk>50?t.am:t.gn;return<div key={z.zone} style={{background:t.cd,border:`1px solid ${t.bd}`,borderRadius:10,padding:"12px 14px"}}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:12,color:t.tx,fontFamily:F.b}}>{z.zone}</span><span style={{fontSize:14,fontWeight:700,color:c,fontFamily:F.m}}>{z.risk}</span></div><div style={{marginTop:8,height:4,background:t.bd,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:`${z.risk}%`,background:c,borderRadius:2}}/></div></div>})}</div>
        <div style={{background:t.amD,border:`1px solid ${t.am}44`,borderRadius:14,padding:"18px"}}><div style={{fontSize:14,fontWeight:700,color:t.am,fontFamily:F.s,marginBottom:8}}>⚠ High claim volume predicted</div><div style={{fontSize:13,color:t.tx,lineHeight:1.7,fontFamily:F.b}}>Predictive model forecasts <strong>{p.predicted_claims_next_week} rider claims</strong> next week (est. payout <strong>{fmt(p.predicted_payout)}</strong>). Key drivers: continuing LPG supply crisis affecting restaurant operations, early monsoon signals from IMD, and infrastructure disruptions in south Bengaluru.</div></div>
      </div></div>
    </div>
  );
}

/* ═══ ROOT ══════════════════════════════════════════════════════════════════ */
export default function App(){
  const[dark,setDark]=useState(true);const t=TH[dark?"dark":"light"];const r=useResp();
  const[user,setUser]=useState(null);const[screen,setScreen]=useState("auth");const[isAdmin,setIsAdmin]=useState(false);const[pricing,setPricing]=useState(null);const[toast,setToast]=useState("");
  useEffect(()=>{injectCSS(t)},[dark]);
  const showToast=m=>{setToast(m);setTimeout(()=>setToast(""),3500)};

  const handleAuth=async(u,mode)=>{setUser(u);if(mode==="signup"||!u.zones?.length)setScreen("onboard");else setScreen("dash")};
  const handleOnboard=async(data)=>{const u={...user,...data};setUser(u);setScreen("engine")};
  const handleEngDone=async()=>{const p=await api.pricing({rider_id:user.id,zones:user.zones,income_bracket:user.income_bracket});if(p)setPricing(p);setScreen("quote")};
  const handleActivate=async()=>{showToast("🐾 Processing Razorpay payment…");const pol=await api.activatePolicy(user.id,pricing?.premium||130);setTimeout(()=>{showToast(`🐾 Coverage active! Policy: ${pol?.id||"activated"}`);setScreen("dash")},1500)};
  const handleSignout=async()=>{await api.signout();api.token=null;setUser(null);setScreen("auth");setIsAdmin(false)};

  const navItems=[{id:"dash",l:"Dashboard"},{id:"fraud",l:"Security"}];

  return(
    <div style={{display:"flex",flexDirection:"column",height:"100vh",width:"100%",background:t.bg,overflow:"hidden",fontFamily:F.b}}>
      {/* Top bar */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:r.desk?"16px 32px":"14px 20px",background:t.sf,borderBottom:`1px solid ${t.bd}`,position:"sticky",top:0,zIndex:50}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}><div style={{width:38,height:38,borderRadius:11,background:`linear-gradient(135deg,${t.tl},${t.tlM})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,boxShadow:`0 0 20px ${t.tl}44`}}>🐾</div><div><div style={{fontFamily:F.s,fontWeight:800,fontSize:17,color:t.tx}}>MeowVault</div><div style={{fontSize:10,color:t.txM,fontFamily:F.m}}>{isAdmin?"INSURER ADMIN":"INCOME PROTECTION · PWA"}</div></div></div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {user&&r.desk&&!isAdmin&&screen!=="auth"&&screen!=="onboard"&&screen!=="engine"&&screen!=="quote"&&navItems.map(n=><button key={n.id} onClick={()=>setScreen(n.id)} style={{padding:"8px 16px",borderRadius:20,border:"none",background:screen===n.id?t.tlD:"transparent",color:screen===n.id?t.tl:t.txM,fontFamily:F.m,fontSize:12,cursor:"pointer"}}>{n.l}</button>)}
          {user&&<button onClick={()=>setIsAdmin(a=>!a)} style={{background:isAdmin?t.amD:t.cd2,border:`1px solid ${isAdmin?t.am+"55":t.bd}`,borderRadius:22,padding:"7px 12px",fontSize:11,color:isAdmin?t.am:t.txM,cursor:"pointer",fontFamily:F.m,fontWeight:500}}>{isAdmin?"← Rider":"Admin →"}</button>}
          <button onClick={()=>setDark(d=>!d)} style={{background:t.cd2,border:`1px solid ${t.bd}`,borderRadius:22,padding:"7px 14px",fontSize:13,color:t.txM,cursor:"pointer",fontFamily:F.m}}>{dark?"☀":"◑"}</button>
          {user&&<button onClick={handleSignout} style={{background:t.rdD,border:`1px solid ${t.rd}44`,borderRadius:22,padding:"7px 12px",fontSize:11,color:t.rd,cursor:"pointer",fontFamily:F.m,fontWeight:500}}>Sign out</button>}
        </div>
      </div>

      {/* Content */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {isAdmin?<AdminScreen t={t} r={r}/>:<>
          {screen==="auth"&&<AuthScreen t={t} onAuth={handleAuth} r={r}/>}
          {screen==="onboard"&&user&&<OnboardScreen t={t} user={user} onComplete={handleOnboard} r={r}/>}
          {screen==="engine"&&user&&<EngineScreen t={t} onDone={handleEngDone} user={user} r={r}/>}
          {screen==="quote"&&<QuoteScreen t={t} pricing={pricing} onActivate={handleActivate} r={r}/>}
          {screen==="dash"&&user&&<DashScreen t={t} user={user} r={r} showToast={showToast}/>}
          {screen==="fraud"&&<FraudScreen t={t} r={r}/>}
        </>}
      </div>

      {/* Mobile bottom nav */}
      {!r.desk&&user&&!isAdmin&&(screen==="dash"||screen==="fraud")&&<div style={{display:"flex",borderTop:`1px solid ${t.bd}`,background:t.sf,position:"sticky",bottom:0,zIndex:50}}>
        {navItems.map(n=><button key={n.id} onClick={()=>setScreen(n.id)} style={{flex:1,padding:"12px",display:"flex",flexDirection:"column",alignItems:"center",gap:4,background:"none",border:"none",cursor:"pointer",color:screen===n.id?t.tl:t.txM}}><span style={{fontSize:10,fontFamily:F.m}}>{n.l}</span></button>)}
      </div>}

      <Toast msg={toast} t={t}/>
    </div>
  );
}
