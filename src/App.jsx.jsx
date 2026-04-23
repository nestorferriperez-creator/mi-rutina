import { useState, useEffect, useRef } from "react";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://eaksmrqwaejprkagonjk.supabase.co',
  'sb_publishable_YU0pqcTp8kBnbltjjpgNRw_vixsc5qA'
);

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const DAYS = ["L","M","X","J","V","S","D"];
const ICONS = { green:"✅", yellow:"🟡", orange:"🟠", red:"❌" };
const START = new Date(2026, 3, 24);

const SCHEDULE = [
  { time:"08:00 — 09:00", emoji:"🌅", title:"Desayuno + Despertar", color:"#e8ff47", tag:"mañana", session:null, tips:[] },
  { time:"09:00 — 11:00", emoji:"🏋️", title:"Gimnasio + Sauna + Ducha fría", color:"#47ff9a", tag:"salud · 2h", session:null, tips:[] },
  { time:"11:00 — 13:00", emoji:"📚", title:"Estudio", color:"#47c4ff", tag:"estudio · 2h", session:null,
    tips:[
      { icon:"🎯", label:"Juega con propósito", text:"Si estudias, estudias. Sin móvil, sin juego. Cada bloque es sagrado." },
      { icon:"💪", label:"Músculo de concentración", text:"Cuando la concentración se vaya, vuelve sin castigarte. Se entrena con repetición, no con perfección." },
      { icon:"📋", label:"Revisión de manos", text:"Este es el momento de analizar y celebrar — nunca en caliente durante el juego." },
    ]
  },
  { time:"13:00 — 14:00", emoji:"🍽️", title:"Comida + Descanso real", color:"#ffb347", tag:"comida", session:null,
    tips:[
      { icon:"🚫", label:"Sin mezclar", text:"Si comes, comes. Sin juego ni móvil. Mezclar debilita el músculo de la concentración." },
      { icon:"🔋", label:"Recarga real", text:"El descanso aquí no es negociable — tu cerebro lo necesita para rendir en las sesiones de tarde." },
    ]
  },
  { time:"14:00 — 16:00", emoji:"😴", title:"Descanso", color:"#c47fff", tag:"descanso · 2h", session:null,
    tips:[
      { icon:"🍎", label:"Merienda antes de las 16:00", text:"El cerebro necesita glucosa para arrancar. No entres a jugar en vacío — el fallo temprano suele ser fisiológico, no mental." },
    ]
  },
  { time:"16:00 — 19:00", emoji:"🧠", title:"Sesión de Juego", color:"#ff6b6b", tag:"juego · 3h", session:null,
    tips:[
      { icon:"🎯", label:"Define un objetivo antes de abrir", text:"Cámbialo respecto a la sesión anterior. Juega con propósito, no en piloto automático." },
      { icon:"🪑", label:"SIT OUT emocional", text:"Emociones negativas → levántate, haz flexiones, bebe agua. La acción física rompe el bucle. No digas 'no voy a pensar' — actúa." },
      { icon:"➡️", label:"Frase ancla", text:"Cuando algo salga mal: 'vamos a por la siguiente mano.' Nada más. Sin analizar en caliente." },
      { icon:"⚡", label:"Fallo rápido = señal física", text:"¿Has comido? ¿Bebido agua? ¿Descansado? Casi siempre es fisiológico, no mental." },
    ]
  },
  { time:"19:00 — 20:00", emoji:"🥘", title:"Cena", color:"#ffb347", tag:"comida", session:null,
    tips:[
      { icon:"🔄", label:"Reset entre sesiones", text:"Si comes, comes. Esta pausa desconecta el juego y te prepara para llegar a la sesión nocturna con la mente más fresca." },
    ]
  },
  { time:"20:00 — 23:00", emoji:"🧠", title:"Sesión de Juego", color:"#ff6b6b", tag:"juego · 3h", session:null,
    tips:[
      { icon:"🌊", label:"Ritual de arranque", text:"No te levantes del sofá y empieces. Lávate la cara, muévete. Engaña al cerebro para que se ponga en modo mañana." },
      { icon:"🎾", label:"Energía Godó", text:"Entra con la alegría e ilusión que sentiste en el Godó. Como algo que disfrutas, no como una obligación." },
      { icon:"🌱", label:"Sin presión de rendimiento", text:"Las primeras semanas el objetivo es instalar el hábito, no rendir al máximo." },
      { icon:"➡️", label:"Mismo protocolo que la tarde", text:"Objetivo definido, SIT OUT si hay emociones, 'vamos a por la siguiente mano' cuando algo salga mal." },
    ]
  },
  { time:"23:00 — 00:00", emoji:"📵", title:"Desconexión", color:"#a0a0c0", tag:"noche", session:null,
    tips:[
      { icon:"🚿", label:"Ducha de agua caliente", text:"Ritual de cierre trabajado con Enhamed. Le dice a tu sistema nervioso que el día de juego terminó. Sin esto la mente sigue en modo juego y el sueño se resiente." },
    ]
  },
  { time:"00:00 — 08:00", emoji:"🌙", title:"Sueño", color:"#6b8cff", tag:"sueño · 8h", session:null, tips:[] },
];

const SESSIONS_INITIAL = [
  {
    id: 1,
    date: "Abril 2026",
    title: "Sesión 1 — Bases del rendimiento mental",
    summary: "Primera sesión de trabajo con Enhamed. El foco fue establecer los pilares mentales sobre los que construir la rutina: gestión emocional durante el juego, presencia en cada bloque del día y la idea central de no pelear con los pensamientos, sino redirigir la atención hacia la siguiente acción.\n\nEnhamed dejó claro desde el principio: la exigencia está en mantener los horarios, no en ejecutar perfecto cada día. Las primeras semanas no se trata de rendir al máximo, sino de instalar el hábito.",
    keyPoints: [
      "La competición es la ciencia del fracaso. El objetivo no es evitar los errores, sino centrarte en el proceso. No celebres los éxitos ni castigues los errores en el momento — el día siguiente, en la revisión de manos, es cuando reflexionas.",
      "Cuando algo salga mal, una sola frase: 'Vamos a por la siguiente mano.' No rumies, no analices en caliente. Redirige. Cada vez que la concentración se vaya — en el juego, en el estudio, en la comida — vuelve inmediatamente con esa misma frase.",
      "Cada bloque del día es sagrado: si estudias, estudias. Si comes, comes. Si juegas, juegas. Sin móvil, sin mezclar. El músculo de la concentración se entrena igual que el físico — con repetición y consistencia, no con perfección."
    ],
    commitment: "El objetivo central es NO PELEAR CON MIS PENSAMIENTOS. Mejor hecho que perfecto. La exigencia va en mantener los horarios — el resto viene solo.",
    protocols: [
      { icon:"🍎", title:"Merienda pre-sesión tarde", desc:"Merendar antes de la sesión de las 16:00. El cerebro necesita glucosa para rendir — no entres a jugar en vacío." },
      { icon:"🪑", title:"SIT OUT emocional", desc:"Cuando aparezcan emociones negativas durante el juego, usa el sit out y levántate físicamente de la silla. Haz flexiones, bebe agua, muévete. No digas 'no voy a pensar en esto' — haz algo disruptivo que cambie tu estado fisiológico. La acción física rompe el bucle mental." },
      { icon:"🎯", title:"Objetivo antes de cada sesión", desc:"Antes de abrir el cliente, define un objetivo concreto para esa sesión. Cámbialo de una sesión a otra. Jugar con propósito, no en piloto automático." },
      { icon:"🌊", title:"Ritual de arranque sesión noche", desc:"Para la sesión de las 20:00, no te puedes levantar del sofá y empezar a jugar. Simula que te acabas de levantar por la mañana: lávate la cara, muévete, activa el cuerpo. Engaña al cerebro para que se acelere — tu mente rinde mejor cuando está fresca." },
      { icon:"🎾", title:"Energía Godó en la sesión nocturna", desc:"Entra a la sesión de noche con la energía que sentiste en el Godó: alegría, ilusión, ganas de pasártelo bien. No como una obligación — como algo que disfrutas." },
      { icon:"🚿", title:"Ritual de cierre nocturno", desc:"Al terminar la sesión de las 23:00, ducha de agua caliente como rutina de desconexión. Señaliza al cuerpo y a la mente que el día de juego ha terminado." },
    ],
  }
];

function dk(y,m,d) { return `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`; }
function getMonths() {
  const today = new Date();
  const months = [];
  let y = START.getFullYear(), m = START.getMonth();
  while (y < today.getFullYear() || (y === today.getFullYear() && m <= today.getMonth())) {
    months.push({ yr:y, mn:m });
    m++; if (m>11){m=0;y++;}
  }
  return months;
}

// ── STORAGE HELPERS ──
async function storageGet(key) {
  try {
    const { data } = await supabase
      .from('storage_kv')
      .select('value')
      .eq('key', key)
      .single();
    return data ? JSON.parse(data.value) : null;
  } catch { return null; }
}
async function storageSet(key, value) {
  try {
    await supabase
      .from('storage_kv')
      .upsert({ key, value: JSON.stringify(value), updated_at: new Date() });
  } catch {}
}

// ── NAV ──
function NavBar({ page, setPage }) {
  const tabs = [
    { id:"schedule", label:"Rutina", emoji:"📅" },
    { id:"tracker",  label:"Tracker", emoji:"📊" },
    { id:"sessions", label:"Enhamed", emoji:"🧬" },
    { id:"estudio",  label:"Estudio", emoji:"📚" },
  ];
  return (
    <div style={{ display:"flex", gap:4, marginBottom:36, background:"#111118", borderRadius:14, padding:5, border:"1px solid #1e1e2e" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setPage(t.id)} style={{
          flex:1, padding:"10px 8px", borderRadius:10, border:"none", cursor:"pointer",
          background: page===t.id ? "#1e1e3a" : "transparent",
          color: page===t.id ? "#e8e8f0" : "#5a5a7a",
          fontSize:13, fontWeight:500, fontFamily:"inherit",
          display:"flex", alignItems:"center", justifyContent:"center", gap:6,
          transition:"all .15s",
          borderBottom: page===t.id ? "2px solid #47c4ff" : "2px solid transparent",
        }}>
          <span>{t.emoji}</span><span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ── SCHEDULE ──
function parseBlockMinutes(timeStr) {
  const parts = timeStr.split(" — ");
  const toMin = t => { const [h,m] = t.split(":").map(Number); return h*60+m; };
  let start = toMin(parts[0]);
  let end = toMin(parts[1]);
  if (end === 0) end = 24*60;
  if (end < start) end += 24*60;
  return { start, end };
}
function isBlockActive(timeStr) {
  const { start, end } = parseBlockMinutes(timeStr);
  const n = new Date();
  const now = n.getHours()*60 + n.getMinutes();
  if (end > 24*60) return now >= start || now < end - 24*60;
  return now >= start && now < end;
}

function ScheduleBlock({ block, isActive }) {
  const [open, setOpen] = useState(false);
  const hasTips = block.tips && block.tips.length > 0;
  return (
    <div style={{ marginBottom:4, transform:open?"translateX(6px)":"none", transition:"transform .2s", paddingRight: open ? "6px" : "0" }}>
      {isActive && (
        <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, paddingLeft:4 }}>
          <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", background:block.color, boxShadow:`0 0 8px ${block.color}` }}/>
          <span style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:block.color, fontWeight:600 }}>Ahora mismo</span>
        </div>
      )}
      <div
        onClick={() => hasTips && setOpen(!open)}
        style={{ display:"grid", gridTemplateColumns:"80px 1fr", border:`1px solid ${isActive ? block.color : open ? block.color : "#1e1e2e"}`, borderRadius: open ? "12px 12px 0 0" : 12, overflow:"hidden", cursor:hasTips?"pointer":"default", boxShadow: isActive ? `0 0 20px ${block.color}30` : "none", transition:"box-shadow .3s" }}
      >
        <div style={{ background: isActive ? block.color : open ? block.color : "#111118", display:"flex", alignItems:"center", justifyContent:"center", padding:"16px 8px", borderRight:`1px solid ${isActive || open ? block.color : "#1e1e2e"}`, transition:"background .2s" }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:1, color: isActive || open ? "#0a0a0f" : "#5a5a7a", textAlign:"center", lineHeight:1.2, transition:"color .2s", whiteSpace:"pre-line" }}>{block.time.replace(" — ","\n—\n")}</span>
        </div>
        <div style={{ background:"#111118", padding:"16px 20px", display:"flex", alignItems:"center", gap:14 }}>
          <span style={{ fontSize:22, flexShrink:0 }}>{block.emoji}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontWeight:500, fontSize:15, color: isActive ? "#ffffff" : "#e8e8f0" }}>{block.title}</div>
            <div style={{ marginTop:5, display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
              <span style={{ fontSize:10, letterSpacing:1.5, textTransform:"uppercase", padding:"2px 8px", borderRadius:100, fontWeight:500, color:block.color, border:`1px solid ${block.color}`, opacity: isActive ? 1 : .7 }}>{block.tag}</span>
            </div>
          </div>
          {hasTips && (
            <span style={{ fontSize:11, color:"#5a5a7a", flexShrink:0, transform:open?"rotate(180deg)":"none", transition:"transform .2s" }}>▼</span>
          )}
        </div>
      </div>
      <div style={{ maxHeight:open?2000:0, overflow:"hidden", transition:"max-height .4s ease" }}>
        <div style={{ background:"#0e0e1a", border:`1px solid ${block.color}`, borderTop:"none", borderRadius:"0 0 12px 12px", padding:"14px 16px 16px" }}>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(190px, 1fr))", gap:8 }}>
            {block.tips && block.tips.map((tip, i) => (
              <div key={i} style={{ background:"#111118", border:"1px solid #1e1e2e", borderRadius:10, padding:"12px 14px" }}>
                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
                  <span style={{ fontSize:18 }}>{tip.icon}</span>
                  <span style={{ fontSize:11, fontWeight:600, color:block.color, letterSpacing:.5, lineHeight:1.3 }}>{tip.label}</span>
                </div>
                <div style={{ fontSize:12, color:"#8888a8", lineHeight:1.6 }}>{tip.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SchedulePage() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const calc = () => { const n=new Date(); setProgress(Math.round((n.getHours()*60+n.getMinutes())/1440*100)); };
    calc(); const t=setInterval(calc,60000); return ()=>clearInterval(t);
  }, []);
  return (
    <div>
      <div style={{ marginBottom:48 }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(28px,6vw,48px)", letterSpacing:4, color:"#e8ff47" }}>Mi Rutina Diaria</div>
        <div style={{ color:"#5a5a7a", fontSize:13, letterSpacing:2, textTransform:"uppercase", marginTop:8 }}>Horario · 24 horas</div>
        <div style={{ marginTop:20, padding:"14px 18px", borderLeft:"2px solid #47c4ff", background:"rgba(71,196,255,0.05)", borderRadius:"0 8px 8px 0" }}>
          <div style={{ fontSize:14, color:"#a0c8e0", lineHeight:1.7, fontStyle:"italic" }}>"Somos lo que hacemos repetidamente. La excelencia, entonces, no es un acto sino un hábito."</div>
          <div style={{ fontSize:11, color:"#5a5a7a", letterSpacing:2, textTransform:"uppercase", marginTop:8 }}>— Aristóteles</div>
        </div>
      </div>
      <div style={{ marginBottom:32 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", marginBottom:8 }}>
          <span>Progreso del día</span><span style={{ color:"#e8ff47", fontWeight:500 }}>{progress}%</span>
        </div>
        <div style={{ height:3, background:"#1e1e2e", borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progress}%`, background:"linear-gradient(90deg,#e8ff47,#47c4ff)", borderRadius:2, transition:"width 1s ease" }}/>
        </div>
      </div>
      {SCHEDULE.map((block,i) => <ScheduleBlock key={i} block={block} isActive={isBlockActive(block.time)}/>)}
    </div>
  );
}

// ── TRACKER ──
function TrackerPage() {
  const [data, setData] = useState({});
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [popup, setPopup] = useState(null);
  const popupRef = useRef(null);
  const today = new Date();
  const todayKey = dk(today.getFullYear(), today.getMonth(), today.getDate());

  useEffect(() => {
    storageGet("tracker_data").then(val => {
      if (val) setData(val);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    setSaving(true);
    storageSet("tracker_data", data).then(() => {
      setTimeout(() => setSaving(false), 600);
    });
  }, [data, loaded]);

  useEffect(() => {
    const h = (e) => { if(popupRef.current && !popupRef.current.contains(e.target)) setPopup(null); };
    document.addEventListener("mousedown",h); return ()=>document.removeEventListener("mousedown",h);
  }, []);

  function handleClick(e, key) {
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    setPopup({ key, top:r.bottom+8, left:Math.min(r.left, window.innerWidth-260) });
  }
  function setSt(st) {
    setData(prev => { const n={...prev}; if(st) n[popup.key]=st; else delete n[popup.key]; return n; });
    setPopup(null);
  }

  const streak = (() => { let s=0,d=new Date(today); for(let i=0;i<400;i++){const v=data[dk(d.getFullYear(),d.getMonth(),d.getDate())];if(v==="green"||v==="yellow"){s++;d.setDate(d.getDate()-1);}else break;} return s; })();
  const monthPct = (() => { const y=today.getFullYear(),m=today.getMonth(),d=today.getDate(),from=(y===START.getFullYear()&&m===START.getMonth())?START.getDate():1; let done=0,total=d-from+1; for(let i=from;i<=d;i++) if(data[dk(y,m,i)]) done++; return total>0?Math.round(done/total*100):0; })();
  const months = getMonths();
  const COLMAP = { green:{bg:"rgba(71,255,154,.15)",border:"rgba(71,255,154,.5)",text:"#47ff9a"}, yellow:{bg:"rgba(255,220,71,.15)",border:"rgba(255,220,71,.5)",text:"#ffdc47"}, orange:{bg:"rgba(255,140,50,.15)",border:"rgba(255,140,50,.5)",text:"#ff8c32"}, red:{bg:"rgba(255,107,107,.15)",border:"rgba(255,107,107,.5)",text:"#ff6b6b"} };

  if (!loaded) return <div style={{ textAlign:"center", padding:"60px 0", color:"#5a5a7a", fontSize:13, letterSpacing:2 }}>Cargando tracker...</div>;

  return (
    <div>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:18, flexWrap:"wrap", gap:10 }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:30, letterSpacing:3, color:"#47c4ff" }}>📊 Tracker</div>
        <div style={{ display:"flex", gap:18, fontSize:11, letterSpacing:1.5, textTransform:"uppercase", color:"#5a5a7a", alignItems:"center" }}>
          <span>Racha &nbsp;<strong style={{ color:"#e8e8f0" }}>{streak}</strong> 🔥</span>
          <span>Este mes &nbsp;<strong style={{ color:"#e8e8f0" }}>{monthPct}%</strong> ✅</span>
          {saving && <span style={{ color:"#47c4ff", fontSize:10 }}>guardando…</span>}
        </div>
      </div>
      <div style={{ display:"flex", gap:14, marginBottom:20, flexWrap:"wrap" }}>
        {[["rgba(71,255,154,.7)","Cumplido"],["rgba(255,220,71,.7)","Bien"],["rgba(255,140,50,.7)","Regular"],["rgba(255,107,107,.7)","No cumplido"]].map(([c,l])=>(
          <div key={l} style={{ display:"flex", alignItems:"center", gap:6, fontSize:11, letterSpacing:1, textTransform:"uppercase", color:"#5a5a7a" }}>
            <div style={{ width:10, height:10, borderRadius:3, background:c, flexShrink:0 }}/>{l}
          </div>
        ))}
      </div>
      {months.map(({yr,mn})=>{
        const dim=new Date(yr,mn+1,0).getDate(), fd=(new Date(yr,mn,1).getDay()+6)%7;
        return (
          <div key={`${yr}-${mn}`} style={{ marginBottom:24 }}>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:13, letterSpacing:2, color:"#5a5a7a", marginBottom:8 }}>{MONTHS[mn]} {yr}</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
              {DAYS.map(d=><div key={d} style={{ textAlign:"center", fontSize:9, letterSpacing:1, textTransform:"uppercase", color:"#5a5a7a", paddingBottom:4, fontWeight:500 }}>{d}</div>)}
              {Array.from({length:fd}).map((_,i)=><div key={`e${i}`} style={{ aspectRatio:"1" }}/>)}
              {Array.from({length:dim}).map((_,i)=>{
                const d=i+1, key=dk(yr,mn,d), st=data[key];
                const isToday=key===todayKey;
                const col=st?COLMAP[st]:null;
                const isBeforeStart=new Date(yr,mn,d)<START;
                if(isBeforeStart) return <div key={d} style={{ aspectRatio:"1" }}/>;
                return (
                  <div key={d} onClick={(e)=>handleClick(e,key)}
                    style={{ aspectRatio:"1", borderRadius:7, border:`1px solid ${isToday?"#47c4ff":col?col.border:"#1e1e2e"}`, background:col?col.bg:"#111118", boxShadow:isToday?"0 0 0 1px #47c4ff":"none", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2, cursor:"pointer", transition:"transform .12s", minWidth:0 }}
                    onMouseEnter={e=>e.currentTarget.style.transform="scale(1.12)"}
                    onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}
                  >
                    <div style={{ fontSize:9, color:col?col.text:"#5a5a7a", fontWeight:500, lineHeight:1 }}>{d}</div>
                    <div style={{ fontSize:11, lineHeight:1 }}>{st?ICONS[st]:""}</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      {popup && (
        <div ref={popupRef} style={{ position:"fixed", top:popup.top, left:popup.left, background:"#16162a", border:"1px solid #3a3a5a", borderRadius:14, padding:10, display:"flex", gap:7, zIndex:99999, boxShadow:"0 20px 60px rgba(0,0,0,.9)" }}>
          {[["green","✅","rgba(71,255,154,.2)"],["yellow","🟡","rgba(255,220,71,.2)"],["orange","🟠","rgba(255,140,50,.2)"],["red","❌","rgba(255,107,107,.2)"]].map(([st,ic,bg])=>(
            <button key={st} onClick={()=>setSt(st)} style={{ width:44, height:44, borderRadius:10, border:"none", cursor:"pointer", fontSize:22, background:bg, display:"flex", alignItems:"center", justifyContent:"center" }}>{ic}</button>
          ))}
          <button onClick={()=>setSt(null)} style={{ width:44, height:44, borderRadius:10, border:"none", cursor:"pointer", fontSize:14, color:"#888", background:"rgba(255,255,255,.06)" }}>✕</button>
        </div>
      )}
    </div>
  );
}

// ── SESSIONS ──
function SessionCard({ session, index, onUpdate }) {
  const [open, setOpen] = useState(index === 0);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(session);

  function save() { onUpdate(draft); setEditing(false); }

  return (
    <div style={{ border:"1px solid #1e1e2e", borderRadius:14, overflow:"hidden", marginBottom:8, transition:"border-color .2s", borderColor: open ? "#47c4ff" : "#1e1e2e" }}>
      <div onClick={() => { if(!editing) setOpen(!open); }} style={{ padding:"16px 20px", display:"flex", alignItems:"center", gap:14, cursor:"pointer", background:"#111118" }}>
        <div style={{ width:36, height:36, borderRadius:10, background:"rgba(71,196,255,.15)", border:"1px solid rgba(71,196,255,.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
          <span style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, color:"#47c4ff" }}>{index+1}</span>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontWeight:500, fontSize:15, color:"#e8e8f0" }}>{session.title || `Sesión ${index+1}`}</div>
          {session.date && <div style={{ fontSize:11, color:"#5a5a7a", marginTop:3, letterSpacing:1 }}>{session.date}</div>}
        </div>
        <span style={{ fontSize:11, color:"#5a5a7a", transform:open?"rotate(180deg)":"none", transition:"transform .2s" }}>▼</span>
      </div>

      <div style={{ maxHeight:open?3000:0, overflow:"hidden", transition:"max-height .4s ease" }}>
        <div style={{ padding:"0 20px 20px", borderTop:"1px solid #1e1e2e", paddingTop:16, background:"#0e0e1a" }}>
          {!editing ? (
            <div>
              {session.date && <div style={{ fontSize:12, color:"#5a5a7a", marginBottom:12 }}>📅 {session.date}</div>}
              {session.summary && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#47c4ff", marginBottom:8 }}>Resumen</div>
                  <div style={{ fontSize:14, color:"#c0c0d8", lineHeight:1.8, whiteSpace:"pre-wrap" }}>{session.summary}</div>
                </div>
              )}
              {session.keyPoints && session.keyPoints.some(k=>k) && (
                <div style={{ marginBottom:16 }}>
                  <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#e8ff47", marginBottom:8 }}>Puntos clave</div>
                  {session.keyPoints.filter(k=>k).map((k,i)=>(
                    <div key={i} style={{ display:"flex", gap:10, marginBottom:6, alignItems:"flex-start" }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:"#e8ff47", flexShrink:0, marginTop:6 }}/>
                      <div style={{ fontSize:14, color:"#c0c0d8", lineHeight:1.6 }}>{k}</div>
                    </div>
                  ))}
                </div>
              )}
              {session.commitment && (
                <div style={{ padding:"12px 16px", background:"rgba(232,255,71,.05)", border:"1px solid rgba(232,255,71,.15)", borderRadius:10 }}>
                  <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#e8ff47", marginBottom:6 }}>Compromiso</div>
                  <div style={{ fontSize:14, color:"#c0c0d8", lineHeight:1.6 }}>{session.commitment}</div>
                </div>
              )}
              {session.protocols && session.protocols.length > 0 && (
                <div style={{ marginBottom:16, marginTop:24 }}>
                  <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#ff6b6b", marginBottom:10 }}>Herramientas y protocolos</div>
                  <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    {session.protocols.map((p,i)=>(
                      <div key={i} style={{ display:"flex", gap:12, padding:"12px 14px", background:"rgba(255,107,107,0.05)", border:"1px solid rgba(255,107,107,0.15)", borderRadius:10, alignItems:"flex-start" }}>
                        <span style={{ fontSize:20, flexShrink:0, marginTop:1 }}>{p.icon}</span>
                        <div>
                          <div style={{ fontSize:13, fontWeight:500, color:"#e8e8f0", marginBottom:4 }}>{p.title}</div>
                          <div style={{ fontSize:13, color:"#a0a0b8", lineHeight:1.6 }}>{p.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {!session.summary && !session.commitment && !session.protocols && (
                <div style={{ textAlign:"center", padding:"20px 0", color:"#5a5a7a", fontSize:13 }}>Sin rellenar todavía</div>
              )}
              <button onClick={()=>{setDraft(session);setEditing(true);}} style={{ marginTop:16, padding:"8px 16px", borderRadius:8, border:"1px solid #3a3a5a", background:"transparent", color:"#a0a0c0", cursor:"pointer", fontSize:12, letterSpacing:1 }}>
                ✏️ Editar sesión
              </button>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", display:"block", marginBottom:6 }}>Título</label>
                <input value={draft.title} onChange={e=>setDraft({...draft,title:e.target.value})} style={{ width:"100%", background:"#111118", border:"1px solid #2e2e4e", borderRadius:8, padding:"8px 12px", color:"#e8e8f0", fontSize:14, fontFamily:"inherit", outline:"none" }}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", display:"block", marginBottom:6 }}>Fecha</label>
                <input value={draft.date} onChange={e=>setDraft({...draft,date:e.target.value})} placeholder="ej: 24 abril 2026" style={{ width:"100%", background:"#111118", border:"1px solid #2e2e4e", borderRadius:8, padding:"8px 12px", color:"#e8e8f0", fontSize:14, fontFamily:"inherit", outline:"none" }}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", display:"block", marginBottom:6 }}>Resumen de la sesión</label>
                <textarea value={draft.summary} onChange={e=>setDraft({...draft,summary:e.target.value})} rows={5} placeholder="Escribe aquí el resumen de lo que trabajasteis..." style={{ width:"100%", background:"#111118", border:"1px solid #2e2e4e", borderRadius:8, padding:"8px 12px", color:"#e8e8f0", fontSize:14, fontFamily:"inherit", outline:"none", resize:"vertical" }}/>
              </div>
              <div style={{ marginBottom:14 }}>
                <label style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", display:"block", marginBottom:6 }}>Puntos clave (3)</label>
                {draft.keyPoints.map((kp,i)=>(
                  <input key={i} value={kp} onChange={e=>{ const kps=[...draft.keyPoints]; kps[i]=e.target.value; setDraft({...draft,keyPoints:kps}); }} placeholder={`Punto clave ${i+1}`} style={{ width:"100%", background:"#111118", border:"1px solid #2e2e4e", borderRadius:8, padding:"8px 12px", color:"#e8e8f0", fontSize:14, fontFamily:"inherit", outline:"none", marginBottom:6 }}/>
                ))}
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", display:"block", marginBottom:6 }}>Compromiso para la próxima semana</label>
                <textarea value={draft.commitment} onChange={e=>setDraft({...draft,commitment:e.target.value})} rows={3} placeholder="¿Qué te llevas de esta sesión? ¿Qué vas a aplicar?" style={{ width:"100%", background:"#111118", border:"1px solid #2e2e4e", borderRadius:8, padding:"8px 12px", color:"#e8e8f0", fontSize:14, fontFamily:"inherit", outline:"none", resize:"vertical" }}/>
              </div>
              <div style={{ display:"flex", gap:8 }}>
                <button onClick={save} style={{ padding:"10px 20px", borderRadius:8, border:"none", background:"#47c4ff", color:"#0a0a0f", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"inherit" }}>Guardar</button>
                <button onClick={()=>setEditing(false)} style={{ padding:"10px 20px", borderRadius:8, border:"1px solid #3a3a5a", background:"transparent", color:"#a0a0c0", cursor:"pointer", fontSize:13, fontFamily:"inherit" }}>Cancelar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SessionsPage() {
  const [sessions, setSessions] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    storageGet("sessions_data").then(val => {
      setSessions(val || SESSIONS_INITIAL);
    });
  }, []);

  useEffect(() => {
    if (sessions === null) return;
    setSaving(true);
    storageSet("sessions_data", sessions).then(() => {
      setTimeout(() => setSaving(false), 600);
    });
  }, [sessions]);

  function updateSession(index, updated) {
    setSessions(prev => prev.map((s,i) => i===index ? updated : s));
  }
  function addSession() {
    setSessions(prev => [...prev, { id:prev.length+1, date:"", title:`Sesión ${prev.length+1}`, summary:"", keyPoints:["","",""], commitment:"" }]);
  }

  if (!sessions) return <div style={{ textAlign:"center", padding:"60px 0", color:"#5a5a7a", fontSize:13, letterSpacing:2 }}>Cargando sesiones...</div>;

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(28px,6vw,44px)", letterSpacing:4, color:"#e8ff47" }}>Sesiones con Enhamed</div>
        <div style={{ color:"#5a5a7a", fontSize:13, letterSpacing:2, textTransform:"uppercase", marginTop:6 }}>Psicólogo deportivo de alto rendimiento</div>
        <div style={{ marginTop:16, display:"flex", gap:10, alignItems:"center" }}>
          <div style={{ width:40, height:40, borderRadius:10, background:"rgba(232,255,71,.1)", border:"1px solid rgba(232,255,71,.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🧬</div>
          <div style={{ fontSize:13, color:"#a0a0b8", lineHeight:1.6 }}>
            Registro de tus sesiones de psicología deportiva.<br/>
            <span style={{ color:"#5a5a7a" }}>Lo que trabajas aquí construye la base mental de tu rutina.</span>
          </div>
        </div>
      </div>

      <div style={{ display:"flex", gap:16, marginBottom:28, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:100, padding:"14px 16px", background:"#111118", border:"1px solid #1e1e2e", borderRadius:12, textAlign:"center" }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:"#47c4ff" }}>{sessions.length}</div>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", marginTop:2 }}>Sesiones</div>
        </div>
        <div style={{ flex:1, minWidth:100, padding:"14px 16px", background:"#111118", border:"1px solid #1e1e2e", borderRadius:12, textAlign:"center" }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:"#e8ff47" }}>{sessions.filter(s=>s.summary).length}</div>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", marginTop:2 }}>Completadas</div>
        </div>
        <div style={{ flex:1, minWidth:100, padding:"14px 16px", background:"#111118", border:"1px solid #1e1e2e", borderRadius:12, textAlign:"center" }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:"#ff6b6b" }}>{sessions.filter(s=>s.commitment).length}</div>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", marginTop:2 }}>Con compromiso</div>
        </div>
        {saving && <div style={{ width:"100%", textAlign:"right", fontSize:10, color:"#47c4ff", letterSpacing:1 }}>guardando…</div>}
      </div>

      {sessions.map((s,i) => <SessionCard key={s.id} session={s} index={i} onUpdate={(u)=>updateSession(i,u)}/>)}

      <button onClick={addSession} style={{ width:"100%", marginTop:12, padding:"14px", borderRadius:12, border:"1px dashed #3a3a5a", background:"transparent", color:"#5a5a7a", cursor:"pointer", fontSize:14, fontFamily:"inherit", transition:"border-color .2s, color .2s" }}
        onMouseEnter={e=>{e.currentTarget.style.borderColor="#47c4ff";e.currentTarget.style.color="#47c4ff";}}
        onMouseLeave={e=>{e.currentTarget.style.borderColor="#3a3a5a";e.currentTarget.style.color="#5a5a7a";}}>
        + Nueva sesión
      </button>
    </div>
  );
}

// ── ESTUDIO ──
const STUDY_INITIAL = [
  {
    id: "solver-kings",
    title: "Curso Solver Kings",
    emoji: "👑",
    color: "#e8ff47",
    items: Array.from({length:20}, (_,i) => ({ id:`sk-${i+1}`, label:`Vídeo ${i+1}`, done:false }))
  },
  {
    id: "little-recres",
    title: "Juego vs Recres — Little",
    emoji: "📄",
    color: "#47c4ff",
    items: [{ id:"lr-1", label:"Documento completo", done:false }]
  },
  {
    id: "raul-recres",
    title: "Raúl vs Recres",
    emoji: "🎬",
    color: "#ff6b6b",
    items: Array.from({length:12}, (_,i) => ({ id:`rr-${i+1}`, label:`Vídeo ${i+1}`, done:false }))
  },
  {
    id: "raul-nits",
    title: "Juego vs Nits — Raúl",
    emoji: "🎯",
    color: "#47ff9a",
    items: Array.from({length:3}, (_,i) => ({ id:`rn-${i+1}`, label:`Vídeo ${i+1}`, done:false }))
  },
  {
    id: "raul-mwp",
    title: "Raúl en MWP",
    emoji: "🏆",
    color: "#c47fff",
    items: Array.from({length:8}, (_,i) => ({ id:`rm-${i+1}`, label:`Vídeo ${i+1}`, done:false }))
  },
  {
    id: "raul-teoria",
    title: "Teoría de Raúl",
    emoji: "🧪",
    color: "#ffb347",
    items: [
      { id:"rt-1", label:"TEORÍA Juego vs Recreacionales", done:false },
      { id:"rt-2", label:"TEORÍA Multiway Pots", done:false },
    ]
  },
];

function StudyBlock({ block, onToggle }) {
  const [open, setOpen] = useState(false);
  const total = block.items.length;
  const done = block.items.filter(i => i.done).length;
  const allDone = done === total;
  const pct = Math.round(done / total * 100);

  return (
    <div style={{ marginBottom:8, opacity: allDone ? 0.4 : 1, transition:"opacity .4s" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display:"grid", gridTemplateColumns:"1fr auto", alignItems:"center", gap:12, padding:"14px 18px", background:"#111118", border:`1px solid ${open ? block.color : "#1e1e2e"}`, borderRadius: open ? "12px 12px 0 0" : 12, cursor:"pointer", transition:"border-color .2s" }}
      >
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:20 }}>{block.emoji}</span>
          <div>
            <div style={{ fontWeight:500, fontSize:14, color: allDone ? "#5a5a7a" : "#e8e8f0", textDecoration: allDone ? "line-through" : "none" }}>{block.title}</div>
            <div style={{ marginTop:5, height:3, width:120, background:"#1e1e2e", borderRadius:2, overflow:"hidden" }}>
              <div style={{ height:"100%", width:`${pct}%`, background:block.color, borderRadius:2, transition:"width .3s" }}/>
            </div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:11, color: done>0 ? block.color : "#5a5a7a", letterSpacing:1 }}>{done}/{total}</span>
          <span style={{ fontSize:11, color:"#5a5a7a", transform:open?"rotate(180deg)":"none", transition:"transform .2s" }}>▼</span>
        </div>
      </div>
      <div style={{ maxHeight:open?2000:0, overflow:"hidden", transition:"max-height .4s ease" }}>
        <div style={{ background:"#0e0e1a", border:`1px solid ${block.color}`, borderTop:"none", borderRadius:"0 0 12px 12px", padding:"8px 12px 12px" }}>
          {block.items.map(item => (
            <div
              key={item.id}
              onClick={() => onToggle(block.id, item.id)}
              style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 8px", borderRadius:8, cursor:"pointer", transition:"background .15s" }}
              onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.04)"}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}
            >
              <div style={{ width:18, height:18, borderRadius:5, border:`1.5px solid ${item.done ? block.color : "#3a3a5a"}`, background: item.done ? block.color : "transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all .2s" }}>
                {item.done && <span style={{ fontSize:11, color:"#0a0a0f", fontWeight:700 }}>✓</span>}
              </div>
              <span style={{ fontSize:13, color: item.done ? "#5a5a7a" : "#c0c0d8", textDecoration: item.done ? "line-through" : "none", transition:"all .2s" }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EstudioPage() {
  const [blocks, setBlocks] = useState(null);

  useEffect(() => {
    storageGet("estudio_data").then(val => {
      if (!val) { setBlocks(STUDY_INITIAL); return; }
      const merged = STUDY_INITIAL.map(defaultBlock => {
        const stored = val.find(b => b.id === defaultBlock.id);
        if (!stored) return defaultBlock;
        const mergedItems = defaultBlock.items.map(defaultItem => {
          const storedItem = stored.items.find(i => i.id === defaultItem.id);
          return storedItem ? storedItem : defaultItem;
        });
        return {...defaultBlock, items: mergedItems};
      });
      setBlocks(merged);
    });
  }, []);

  useEffect(() => {
    if (!blocks) return;
    storageSet("estudio_data", blocks);
  }, [blocks]);

  function handleToggle(blockId, itemId) {
    setBlocks(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      const updatedItems = b.items.map(i => i.id === itemId ? {...i, done:!i.done} : i);
      return {...b, items: updatedItems};
    }));
  }

  if (!blocks) return <div style={{ textAlign:"center", padding:"60px 0", color:"#5a5a7a", fontSize:13, letterSpacing:2 }}>Cargando...</div>;

  const pending = blocks.filter(b => !b.items.every(i => i.done));
  const completed = blocks.filter(b => b.items.every(i => i.done));
  const totalItems = blocks.reduce((a,b) => a + b.items.length, 0);
  const doneItems = blocks.reduce((a,b) => a + b.items.filter(i=>i.done).length, 0);

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(28px,6vw,44px)", letterSpacing:4, color:"#e8ff47" }}>Pendiente de Estudio</div>
        <div style={{ color:"#5a5a7a", fontSize:13, letterSpacing:2, textTransform:"uppercase", marginTop:6 }}></div>
      </div>

      <div style={{ display:"flex", gap:12, marginBottom:28 }}>
        <div style={{ flex:1, padding:"14px 16px", background:"#111118", border:"1px solid #1e1e2e", borderRadius:12, textAlign:"center" }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:"#e8ff47" }}>{totalItems - doneItems}</div>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", marginTop:2 }}>Pendientes</div>
        </div>
        <div style={{ flex:1, padding:"14px 16px", background:"#111118", border:"1px solid #1e1e2e", borderRadius:12, textAlign:"center" }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:"#47ff9a" }}>{doneItems}</div>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", marginTop:2 }}>Completados</div>
        </div>
        <div style={{ flex:1, padding:"14px 16px", background:"#111118", border:"1px solid #1e1e2e", borderRadius:12, textAlign:"center" }}>
          <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:32, color:"#47c4ff" }}>{Math.round(doneItems/totalItems*100)}%</div>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", marginTop:2 }}>Progreso</div>
        </div>
      </div>

      {pending.map(b => <StudyBlock key={b.id} block={b} onToggle={handleToggle}/>)}

      {completed.length > 0 && (
        <div style={{ marginTop:24 }}>
          <div style={{ fontSize:10, letterSpacing:2, textTransform:"uppercase", color:"#5a5a7a", marginBottom:12 }}>✅ Completados</div>
          {completed.map(b => <StudyBlock key={b.id} block={b} onToggle={handleToggle}/>)}
        </div>
      )}
    </div>
  );
}

// ── APP ──
export default function App() {
  const [page, setPage] = useState("schedule");
  return (
    <div style={{ background:"#0a0a0f", minHeight:"100vh", padding:"32px 20px", fontFamily:"'DM Sans',system-ui,sans-serif", color:"#e8e8f0" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap'); * { box-sizing:border-box; } textarea,input { color-scheme: dark; } body { background:#0a0a0f; margin:0; }`}</style>
      <div style={{ maxWidth:680, margin:"0 auto" }}>
        <NavBar page={page} setPage={setPage}/>
        {page==="schedule" && <SchedulePage/>}
        {page==="tracker"  && <TrackerPage/>}
        {page==="sessions" && <SessionsPage/>}
        {page==="estudio"  && <EstudioPage/>}
        <div style={{ marginTop:44, textAlign:"center", color:"#5a5a7a", fontSize:11, letterSpacing:2, textTransform:"uppercase" }}>Rutina personal · cada día cuenta</div>
      </div>
    </div>
  );
}
