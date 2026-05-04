import { useState, useEffect, useRef } from "react";
import KedarPhoto from "\Kedar.jpeg";

// ─── EmailJS CONFIG (fill these in when ready) ────────────────────────────────
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";

// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
const DARK = {
  bg:          "#111214",
  surface:     "#18191c",
  border:      "#26282d",
  accent:      "#4f8ef7",
  accentDim:   "rgba(79,142,247,0.12)",
  text:        "#e8eaf0",
  muted:       "#6b7280",
  dim:         "#374151",
  green:       "#34d399",
  purple:      "#a78bfa",
  pink:        "#f472b6",
  cardHov:     "#1c1d21",
  inputBg:     "#111214",
  scrollThumb: "#26282d",
};

const LIGHT = {
  bg:          "#f5f6fa",
  surface:     "#ffffff",
  border:      "#e2e4e9",
  accent:      "#2563eb",
  accentDim:   "rgba(37,99,235,0.10)",
  text:        "#111214",
  muted:       "#6b7280",
  dim:         "#9ca3af",
  green:       "#059669",
  purple:      "#7c3aed",
  pink:        "#db2777",
  cardHov:     "#f0f1f6",
  inputBg:     "#f9fafb",
  scrollThumb: "#d1d5db",
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "hero",       label: "Home"       },
  { id: "about",      label: "About"      },
  { id: "skills",     label: "Skills"     },
  { id: "projects",   label: "Projects"   },
  { id: "experience", label: "Experience" },
  { id: "contact",    label: "Contact"    },
];

// ─── SKILLS ───────────────────────────────────────────────────────────────────
const SKILLS = {
  "ML & AI":           ["Scikit-Learn","XGBoost","LightGBM","Deep Learning","Feature Engineering","Hyperparameter Tuning","PySpark"],
  "Programming":       ["Python","Pandas","NumPy","Java (Basics)","Git"],
  "Databases & Cloud": ["MySQL","Oracle","BigQuery","Snowflake","Apache Airflow","ETL"],
  "BI & Analytics":    ["Power BI","Tableau","Advanced Excel","Data Modeling","A/B Testing","Hypothesis Testing","Statistical Analysis"],
  "MLOps & Tools":     ["Docker","MLOps","Business Strategy"],
};

// ─── PROJECTS (hardcoded from your Excel sheet) ───────────────────────────────
const PROJECTS = [
  {
    id: 1,
    Category:     "ML",
    Title:        "Tata Steel Machine Failure Prediction",
    Metric:       "30% reliability improvement",
    Description:  "Optimized 10K+ records with XGBoost and LightGBM, increasing model accuracy by 18% and dataset reliability by 30%.",
    Tech_Stack:   "Python,XGBoost,LightGBM,Scikit-Learn,Pandas,NumPy",
    YouTube_Link: "https://youtu.be/e14_ByN2KuU",
    Drive_Link:   "https://drive.google.com/file/d/1JbtAGiEsq2oKMQym7OE7sx5dYOzrYl1y/view?usp=drive_link",
    GitHub_Link:  "https://github.com/Kedarlimbalkar/tata-failure-prediction",
    LinkedIn_Link:"",
  },
  {
    id: 2,
    Category:     "ML",
    Title:        "Bengaluru House Price Prediction",
    Metric:       "R² = 0.82 · 82% accuracy",
    Description:  "Cleaned 13,320 records with PPS outlier removal. Built a Scikit-Learn Ridge Regression pipeline achieving 82% prediction accuracy across 240+ urban locations.",
    Tech_Stack:   "Python,Scikit-Learn,Ridge Regression,Pandas,NumPy",
    YouTube_Link: "https://youtu.be/TwQctnQoF3k",
    Drive_Link:   "https://drive.google.com/drive/folders/15Q2hNHltGMGN-QOvfmYep0dZj7mle3lu",
    GitHub_Link:  "https://github.com/Kedarlimbalkar/HousePricePrediction",
    LinkedIn_Link:"",
  },
  {
    id: 3,
    Category:     "Business",
    Title:        "Python Basics",
    Metric:       "Problem Solving",
    Description:  "By using logical thinking solved Python problems to enhance problem solving and thinking ability.",
    Tech_Stack:   "Python",
    YouTube_Link: "https://youtu.be/T4Lxxxi2Sb8",
    Drive_Link:   "https://drive.google.com/drive/folders/1sOnJj2gj2_XpA2Ud731QXg4_vnKYBgzM",
    GitHub_Link:  "",
    LinkedIn_Link:"",
  },
  {
    id: 4,
    Category:     "Analytics",
    Title:        "FedEx Logistics Performance Analysis",
    Metric:       "22% Cost Reduction",
    Description:  "Optimized FedEx supply chain efficiency by identifying delivery bottlenecks and cost-saving fulfillment strategies through advanced multivariate data analysis.",
    Tech_Stack:   "Python",
    YouTube_Link: "https://youtu.be/-kTZhDST08I",
    Drive_Link:   "https://drive.google.com/drive/folders/13NUZkxqE-n8Y-pcE_e7p9s9qT65dctWT",
    GitHub_Link:  "https://github.com/Kedarlimbalkar/FedEx-Logistics-Performance-Analysis",
    LinkedIn_Link:"",
  },
];

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useFadeIn() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.06 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function useScrollSpy() {
  const [active, setActive] = useState("hero");
  useEffect(() => {
    const fn = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      [...NAV].reverse().forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) setActive(id);
      });
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return active;
}

// ─── SMALL COMPONENTS ─────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }) {
  const [ref, visible] = useFadeIn();
  return (
    <div ref={ref} style={{
      opacity:    visible ? 1 : 0,
      transform:  visible ? "none" : "translateY(18px)",
      transition: `opacity .55s ease ${delay}s, transform .55s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 11px", margin: "3px 3px 3px 0",
      borderRadius: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.03em",
      color, border: `1px solid ${color}35`, background: `${color}12`,
    }}>{label}</span>
  );
}

function Rule({ T }) {
  return <div style={{ height: 1, background: T.border, margin: "0 0 52px" }} />;
}

function SLabel({ children, T }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
      textTransform: "uppercase", color: T.accent, marginBottom: 8,
    }}>{children}</p>
  );
}

function H2({ children, T }) {
  return (
    <h2 style={{
      fontSize: "clamp(22px,4vw,34px)", fontWeight: 800,
      color: T.text, letterSpacing: "-0.02em", marginBottom: 32,
      fontFamily: "'DM Sans', sans-serif",
    }}>{children}</h2>
  );
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
const IcYT = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
const IcDrive = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.433 22.396L0 15.036l4.433-7.643h8.867l4.433 7.643-4.433 7.36H4.433zm7.485-14.93L7.5 15.036h8.866l-4.448-7.57zM19.567 22.396l-2.216-3.781 6.649-11.52H19.567L15.134 0h4.433l6.433 11.15-6.433 11.246z"/>
  </svg>
);
const IcGH = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);
const IcLI = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// ─── ACTION BUTTON ────────────────────────────────────────────────────────────
function ActionBtn({ icon, label, tooltip, active, activeColor, activeBg, activeBorder, T, onClick }) {
  const [hov, setHov] = useState(false);
  const color  = active ? activeColor : T.dim;
  const bg     = active ? (hov ? activeBg.replace("14","22").replace("12","20") : activeBg) : T.bg;
  const border = active ? activeBorder : T.border;
  return (
    <button
      onClick={active ? onClick : undefined}
      title={active ? tooltip : `${label} not available`}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        padding: "8px 10px", borderRadius: 8, fontSize: 11, fontWeight: 700,
        color, background: bg, border: `1px solid ${border}`,
        cursor: active ? "pointer" : "not-allowed",
        opacity: active ? 1 : 0.38,
        transition: "all .18s", userSelect: "none",
      }}
    >
      {icon}{label}
    </button>
  );
}

// ─── PROJECT CARD ─────────────────────────────────────────────────────────────
function ProjectCard({ project, T }) {
  const [hov, setHov] = useState(false);
  const tags     = (project.Tech_Stack || "").split(",").map(t => t.trim()).filter(Boolean);
  const catColor = { ML: T.accent, Analytics: T.green, Business: T.purple }[project.Category] || T.accent;
  const open     = (url) => { if (url && url !== "#" && url !== "") window.open(url, "_blank", "noopener,noreferrer"); };

  const BTNS = [
    { key:"yt",    label:"YouTube",   icon:<IcYT />,    url:project.YouTube_Link,  activeColor:"#ff0000", activeBg:"#ff000014", activeBorder:"#ff000035", tooltip:"Watch on YouTube" },
    { key:"drive", label:"Drive File",icon:<IcDrive />, url:project.Drive_Link,   activeColor:"#1fa463", activeBg:"#1fa46314", activeBorder:"#1fa46335", tooltip:"Open on Google Drive" },
    { key:"gh",    label:"GitHub",    icon:<IcGH />,    url:project.GitHub_Link,  activeColor:T.text,    activeBg:T.accentDim, activeBorder:T.border,    tooltip:"View on GitHub" },
    { key:"li",    label:"LinkedIn",  icon:<IcLI />,    url:project.LinkedIn_Link,activeColor:"#0a66c2", activeBg:"#0a66c214", activeBorder:"#0a66c235", tooltip:"View LinkedIn post" },
  ];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? T.cardHov : T.surface,
        border: `1px solid ${hov ? catColor + "45" : T.border}`,
        borderRadius: 12, padding: "20px 22px",
        transition: "all .2s",
        display: "flex", flexDirection: "column", height: "100%",
      }}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{
          fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase",
          color:catColor, background:`${catColor}14`, border:`1px solid ${catColor}30`,
          padding:"2px 9px", borderRadius:5,
        }}>{project.Category}</span>
        {project.Metric && (
          <span style={{ fontSize:10, color:T.green, fontWeight:700 }}>✓ {project.Metric}</span>
        )}
      </div>

      <h3 style={{ color:T.text, fontSize:14, fontWeight:700, marginBottom:8, lineHeight:1.5 }}>
        {project.Title}
      </h3>

      <p style={{ color:T.muted, fontSize:13, lineHeight:1.75, flexGrow:1, marginBottom:14 }}>
        {project.Description}
      </p>

      <div style={{ display:"flex", flexWrap:"wrap", gap:4, marginBottom:18 }}>
        {tags.slice(0,5).map(t => (
          <span key={t} style={{
            fontSize:10, padding:"2px 8px", borderRadius:5,
            background:T.bg, color:T.muted, border:`1px solid ${T.border}`,
          }}>{t}</span>
        ))}
      </div>

      <div style={{
        borderTop:`1px solid ${T.border}`, paddingTop:14,
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:7,
      }}>
        {BTNS.map(({ key, label, icon, url, activeColor, activeBg, activeBorder, tooltip }) => (
          <ActionBtn
            key={key} icon={icon} label={label} tooltip={tooltip}
            active={!!(url && url !== "#" && url !== "")}
            activeColor={activeColor} activeBg={activeBg} activeBorder={activeBorder}
            T={T} onClick={() => open(url)}
          />
        ))}
      </div>
    </div>
  );
}

// ─── THEME TOGGLE ─────────────────────────────────────────────────────────────
function ThemeToggle({ dark, onToggle, T }) {
  return (
    <button
      onClick={onToggle}
      title={dark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      style={{
        position:"fixed", top:20, right:20, zIndex:9998,
        width:42, height:42, borderRadius:"50%",
        background:T.surface, border:`1px solid ${T.border}`,
        cursor:"pointer", fontSize:18,
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 2px 12px rgba(0,0,0,0.15)", transition:"all .2s",
      }}
      onMouseEnter={e => e.currentTarget.style.background = T.cardHov}
      onMouseLeave={e => e.currentTarget.style.background = T.surface}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const [dark, setDark] = useState(true);
  const T               = dark ? DARK : LIGHT;
  const active          = useScrollSpy();
  const [filter, setFilter] = useState("All");
  const [form,   setForm]   = useState({ name:"", email:"", message:"" });
  const [status, setStatus] = useState("");

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.Category === filter);

  const handleSubmit = async e => {
    e.preventDefault(); setStatus("sending");
    try {
      const r = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method:"POST", headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          service_id: EMAILJS_SERVICE_ID, template_id: EMAILJS_TEMPLATE_ID,
          user_id: EMAILJS_PUBLIC_KEY, template_params: form,
        }),
      });
      if (r.ok) { setStatus("ok"); setForm({ name:"", email:"", message:"" }); }
      else throw new Error();
    } catch { setStatus("err"); }
  };

  const go = id => document.getElementById(id)?.scrollIntoView({ behavior:"smooth" });

  const inp = {
    width:"100%", boxSizing:"border-box",
    padding:"11px 14px", borderRadius:8,
    background:T.inputBg, border:`1px solid ${T.border}`,
    color:T.text, fontSize:13, outline:"none",
    transition:"border-color .18s", fontFamily:"'DM Sans', sans-serif",
  };

  const EXPERIENCE = [
    {
      role:"Business Analyst Intern", company:"Intucate",
      period:"Jan 2026 – Apr 2026", accent:T.accent,
      points:[
        "Spearheaded end-to-end lifecycle of core content assets, improving educational value and engagement metrics.",
        "Implemented communication protocols aligning departmental goals with the product technical roadmap.",
      ],
    },
    {
      role:"Data Analyst Intern", company:"AtliQ Technologies",
      period:"Dec 2025 – Apr 2026", accent:T.green,
      points:[
        "Applied Python, SQL, and Power BI to real-world analytics, producing actionable business insights.",
        "Transformed raw data pipelines into decision-ready dashboards.",
      ],
    },
    {
      role:"Data Analyst Intern", company:"Unified Mentor",
      period:"Nov 2024 – Dec 2024", accent:T.purple,
      points:[
        "Executed hands-on analytics projects using Python and Tableau.",
        "Applied Google Data Analytics Certificate learnings to live business challenges.",
      ],
    },
    {
      role:"Data Analyst Intern", company:"NullClass",
      period:"Sep 2024 – Oct 2024", accent:T.pink,
      points:[
        "Built interactive Power BI dashboards and enhanced data cleaning techniques.",
        "Derived insights from complex datasets through comprehensive exploratory analysis.",
      ],
    },
  ];

  return (
    <>
      <style>{getCSS(T, dark)}</style>
      <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} T={T} />

      <div style={{
        minHeight:"100vh", width:"100%", background:T.bg, color:T.text,
        fontFamily:"'DM Sans', sans-serif", overflowX:"hidden",
        transition:"background .3s, color .3s",
      }}>

        {/* ── BOTTOM DOCK NAV ── */}
        <nav style={{
          position:"fixed", bottom:18, left:"50%", transform:"translateX(-50%)",
          zIndex:9998, display:"flex", gap:2,
          background:T.surface, border:`1px solid ${T.border}`,
          borderRadius:14, padding:"7px 10px",
          boxShadow:"0 4px 24px rgba(0,0,0,0.2)",
          transition:"background .3s, border-color .3s",
        }}>
          {NAV.map(({ id, label }) => (
            <button key={id} onClick={() => go(id)} style={{
              padding:"6px 14px", borderRadius:9, border:"none",
              background: active === id ? T.accentDim : "none",
              color: active === id ? T.accent : T.muted,
              fontSize:12, fontWeight:600, cursor:"pointer",
              transition:"all .16s", whiteSpace:"nowrap",
            }}>{label}</button>
          ))}
        </nav>

        {/* ════════ HERO ════════ */}
        <section id="hero" style={{
          minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center",
          padding:"80px 48px 120px",
        }}>
          <div className="hero-grid" style={{
            maxWidth:1100, width:"100%", margin:"0 auto",
            display:"grid", gridTemplateColumns:"1fr 260px",
            gap:64, alignItems:"center",
          }}>
            {/* LEFT */}
            <div>
              <p className="anim-1" style={{
                fontSize:10, fontWeight:700, letterSpacing:"0.18em",
                textTransform:"uppercase", color:T.accent, marginBottom:20,
              }}>ML Engineer & Data Scientist</p>

              <h1 className="anim-2" style={{
                fontSize:"clamp(42px,7vw,80px)", fontWeight:900,
                lineHeight:1.02, letterSpacing:"-0.03em", color:T.text,
                marginBottom:20, fontFamily:"'DM Sans', sans-serif",
              }}>
                Kedar<br />
                <span style={{ color:T.accent }}>Limbalkar</span>
              </h1>

              <p className="anim-3" style={{
                color:T.muted, fontSize:15, lineHeight:1.8, maxWidth:460, marginBottom:30,
              }}>
                Building production-grade AI systems that bridge ML architecture
                with data-driven business strategy.
              </p>

              <div className="anim-4 hero-btns" style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button onClick={() => go("projects")} style={{
                  padding:"11px 28px", borderRadius:9,
                  background:T.accent, color:"#fff",
                  fontSize:13, fontWeight:700, border:"none", cursor:"pointer",
                  transition:"opacity .18s",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >View Projects</button>

                {/* ── CV button — opens Google Drive ── */}
                <a
                  href="https://drive.google.com/file/d/131yKvZNlBJb-QVhssULPauhRNTi-_bRy/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding:"11px 28px", borderRadius:9,
                    border:`1px solid ${T.border}`, background:"none",
                    color:T.text, fontSize:13, fontWeight:700,
                    textDecoration:"none", display:"inline-block",
                    transition:"border-color .18s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = T.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = T.border}
                >Download CV</a>
              </div>

              <div className="anim-5 hero-stats" style={{
                display:"flex", gap:40,
                marginTop:48, paddingTop:32, borderTop:`1px solid ${T.border}`,
              }}>
                {[["10K+","Records processed"],["82%","Model accuracy"],["30%","Reliability boost"]].map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontSize:24, fontWeight:800, color:T.text, letterSpacing:"-0.02em" }}>{n}</div>
                    <div style={{ fontSize:11, color:T.muted, marginTop:3 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Photo */}
            <div className="anim-3 hero-photo" style={{
              display:"flex", flexDirection:"column", alignItems:"center",
            }}>
              <div style={{
                width:220, height:220, borderRadius:"50%",
                overflow:"hidden", flexShrink:0,
                border:`3px solid ${T.border}`,
                outline:`5px solid ${T.accentDim}`,
                outlineOffset:3, background:T.surface,
                transition:"border-color .3s, outline-color .3s",
              }}>
                <img
                  src={KedarPhoto}
                  alt="Kedar Limbalkar"
                  style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"center top" }}
                />
              </div>
              <div style={{ marginTop:14, display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:7, height:7, borderRadius:"50%", background:T.green, display:"inline-block" }} />
                <span style={{ fontSize:11, color:T.muted, fontWeight:500 }}>Open to opportunities</span>
              </div>
            </div>
          </div>
        </section>

        {/* ════════ ABOUT ════════ */}
        <section id="about" style={{ padding:"80px 48px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <Rule T={T} />
            <Reveal><SLabel T={T}>About</SLabel><H2 T={T}>Background</H2></Reveal>
            <div className="two-col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"start" }}>
              <Reveal delay={0.05}>
                <p style={{ color:T.muted, fontSize:14, lineHeight:1.85, marginBottom:18 }}>
                  Computer Engineering graduate from GCoEJ, currently pursuing an MS in Computer
                  Science & ML at Woolf University. I build production-grade AI systems and bridge
                  ML architecture with actionable business strategy.
                </p>
                <p style={{ color:T.muted, fontSize:14, lineHeight:1.85, marginBottom:24 }}>
                  With experience across data analytics, business analysis, and ML modelling, I turn
                  raw data into high-impact decisions using Python, SQL, Power BI, and Docker.
                </p>
                

              </Reveal>

              <Reveal delay={0.1}>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {[
                    { deg:"MS — Computer Science: ML & AI", school:"Woolf University", period:"2025 – 2027", color:T.accent },
                    { deg:"B.Tech — Computer Engineering",  school:"GCoEJ",            period:"2021 – 2025", color:T.green  },
                  ].map(e => (
                    <div key={e.deg} style={{
                      padding:"16px 18px", borderRadius:9,
                      background:T.surface, border:`1px solid ${T.border}`,
                      transition:"background .3s",
                    }}>
                      <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:3 }}>{e.deg}</div>
                      <div style={{ fontSize:12, color:e.color }}>{e.school}</div>
                      <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{e.period}</div>
                    </div>
                  ))}
                  <div style={{ padding:"14px 18px", borderRadius:9, background:T.surface, border:`1px solid ${T.border}` }}>
                    {["Core Technical Council 2025","Anchored Carvaan 2024","Anchored Kalasangam 2025"].map(a => (
                      <p key={a} style={{ fontSize:12, color:T.muted, lineHeight:1.9 }}>· {a}</p>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ════════ SKILLS ════════ */}
        <section id="skills" style={{ padding:"80px 48px", background:T.surface, transition:"background .3s" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <Reveal><SLabel T={T}>Skills</SLabel><H2 T={T}>Tech Stack</H2></Reveal>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:12 }}>
              {Object.entries(SKILLS).map(([cat, pills], i) => (
                <Reveal key={cat} delay={i * 0.05}>
                  <div style={{
                    background:T.bg, border:`1px solid ${T.border}`,
                    borderRadius:9, padding:"18px", transition:"background .3s",
                  }}>
                    <p style={{
                      fontSize:10, fontWeight:700, letterSpacing:"0.12em",
                      textTransform:"uppercase", color:T.accent, marginBottom:12,
                    }}>{cat}</p>
                    <div style={{ display:"flex", flexWrap:"wrap" }}>
                      {pills.map(p => <Tag key={p} label={p} color={T.accent} />)}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ PROJECTS ════════ */}
        <section id="projects" style={{ padding:"80px 48px" }}>
          <div style={{ maxWidth:1100, margin:"0 auto" }}>
            <Rule T={T} />
            <Reveal><SLabel T={T}>Projects</SLabel><H2 T={T}>Work</H2></Reveal>

            {/* Filter bar */}
            <Reveal delay={0.04}>
              <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
                {["All","ML","Analytics","Business"].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding:"6px 16px", borderRadius:7, fontSize:12, fontWeight:600,
                    border:`1px solid ${filter === f ? T.accent : T.border}`,
                    background: filter === f ? T.accentDim : "none",
                    color: filter === f ? T.accent : T.muted,
                    cursor:"pointer", transition:"all .15s",
                  }}>{f}</button>
                ))}
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14 }}>
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <ProjectCard project={p} T={T} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ EXPERIENCE ════════ */}
        <section id="experience" style={{ padding:"80px 48px", background:T.surface, transition:"background .3s" }}>
          <div style={{ maxWidth:860, margin:"0 auto" }}>
            <Reveal><SLabel T={T}>Experience</SLabel><H2 T={T}>Timeline</H2></Reveal>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {EXPERIENCE.map((exp, i) => (
                <Reveal key={i} delay={i * 0.06}>
                  <div style={{
                    background:T.bg, border:`1px solid ${T.border}`,
                    borderLeft:`3px solid ${exp.accent}`,
                    borderRadius:"0 9px 9px 0", padding:"18px 24px",
                    transition:"background .3s",
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:10 }}>
                      <div>
                        <span style={{ color:T.text, fontWeight:700, fontSize:14 }}>{exp.role}</span>
                        <span style={{ color:exp.accent, fontSize:13, marginLeft:8, fontWeight:600 }}>{exp.company}</span>
                      </div>
                      <span style={{ fontSize:11, color:T.muted }}>{exp.period}</span>
                    </div>
                    <ul style={{ paddingLeft:16, margin:0 }}>
                      {exp.points.map((pt, j) => (
                        <li key={j} style={{ color:T.muted, fontSize:13, lineHeight:1.75, marginBottom:3 }}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ════════ CONTACT ════════ */}
        <section id="contact" style={{ padding:"80px 48px" }}>
          <div style={{ maxWidth:560, margin:"0 auto" }}>
            <Rule T={T} />
            <Reveal><SLabel T={T}>Contact</SLabel><H2 T={T}>Get in Touch</H2></Reveal>
            <Reveal delay={0.05}>
              <p style={{ color:T.muted, fontSize:14, lineHeight:1.75, marginBottom:28 }}>
                Open to entry-level roles in ML Engineering, Data Science & Business Analytics.
              </p>
              <form onSubmit={handleSubmit}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                  <input type="text" placeholder="Name" required value={form.name}
                    onChange={e => setForm({ ...form, name:e.target.value })} style={inp}
                    onFocus={e => e.target.style.borderColor = T.accent}
                    onBlur={e => e.target.style.borderColor = T.border} />
                  <input type="email" placeholder="Email" required value={form.email}
                    onChange={e => setForm({ ...form, email:e.target.value })} style={inp}
                    onFocus={e => e.target.style.borderColor = T.accent}
                    onBlur={e => e.target.style.borderColor = T.border} />
                </div>
                <textarea placeholder="Message" required rows={5} value={form.message}
                  onChange={e => setForm({ ...form, message:e.target.value })}
                  style={{ ...inp, resize:"vertical", marginBottom:14 }}
                  onFocus={e => e.target.style.borderColor = T.accent}
                  onBlur={e => e.target.style.borderColor = T.border} />
                <button type="submit" disabled={status === "sending"} style={{
                  width:"100%", padding:"12px", borderRadius:9,
                  background:T.accent, color:"#fff",
                  fontSize:13, fontWeight:700, border:"none", cursor:"pointer",
                  opacity: status === "sending" ? 0.7 : 1,
                }}>
                  {status === "sending" ? "Sending…" : status === "ok" ? "✓ Sent!" : "Send Message"}
                </button>
                {status === "err" && (
                  <p style={{ color:"#ef4444", fontSize:12, marginTop:10, textAlign:"center" }}>
                    Failed — email kedarlimbalkar@gmail.com directly.
                  </p>
                )}
              </form>
            </Reveal>
          </div>
        </section>

        {/* ════════ FOOTER ════════ */}
        <footer style={{
          background:T.surface, borderTop:`1px solid ${T.border}`,
          padding:"28px 48px", transition:"background .3s",
        }}>
          <div style={{
            maxWidth:1100, margin:"0 auto",
            display:"flex", justifyContent:"space-between",
            alignItems:"center", flexWrap:"wrap", gap:14,
          }}>
            <div>
              <div style={{ fontWeight:700, fontSize:14, color:T.text }}>Kedar Limbalkar</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>ML Engineer · Data Scientist · Pune, MH</div>
            </div>
            <div style={{ display:"flex", gap:20 }}>
              {[
                ["LinkedIn","https://www.linkedin.com/in/kedarlimbalkar"],
                ["GitHub",  "https://github.com/kedarlimbalkar"],
                ["Email",   "mailto:kedarlimbalkar@gmail.com"],
              ].map(([l, u]) => (
                <a key={l} href={u} target="_blank" rel="noopener noreferrer"
                  style={{ color:T.muted, fontSize:12, fontWeight:500, textDecoration:"none", transition:"color .18s" }}
                  onMouseEnter={e => e.currentTarget.style.color = T.text}
                  onMouseLeave={e => e.currentTarget.style.color = T.muted}
                >{l}</a>
              ))}
            </div>
          </div>
          <div style={{
            maxWidth:1100, margin:"16px auto 0", paddingTop:16,
            borderTop:`1px solid ${T.border}`, textAlign:"center",
          }}>
            <p style={{ fontSize:10, color:T.dim }}>
              © 2026 Kedar Limbalkar · React Portfolio
            </p>
          </div>
        </footer>

      </div>
    </>
  );
}

// ─── CSS ──────────────────────────────────────────────────────────────────────
function getCSS(T, dark) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800;9..40,900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body, #root {
      width: 100%;
      min-height: 100vh;
      background: ${T.bg};
      overflow-x: hidden;
    }

    html { scroll-behavior: smooth; }
    body { margin: 0; padding: 0; }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: ${T.bg}; }
    ::-webkit-scrollbar-thumb { background: ${T.scrollThumb}; border-radius: 4px; }

    .anim-1 { animation: up .6s ease both; }
    .anim-2 { animation: up .6s .1s ease both; }
    .anim-3 { animation: up .6s .2s ease both; }
    .anim-4 { animation: up .6s .3s ease both; }
    .anim-5 { animation: up .6s .4s ease both; }

    @keyframes up {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 720px) {
      .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
      .hero-photo { order: -1; }
      .hero-btns  { justify-content: center; }
      .hero-stats { justify-content: center; }
      .two-col    { grid-template-columns: 1fr !important; }
    }
  `;
}
