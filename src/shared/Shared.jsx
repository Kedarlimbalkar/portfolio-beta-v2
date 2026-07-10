import { useState } from "react";
import { Link } from "react-router-dom";
import { useFadeIn, useTilt } from "./hooks";

// ─── SCROLL REVEAL ────────────────────────────────────────────────────────────
export function Reveal({ children, delay = 0 }) {
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

export function Tag({ label, color }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 11px", margin: "3px 3px 3px 0",
      borderRadius: 6, fontSize: 11, fontWeight: 600, letterSpacing: "0.03em",
      color, border: `1px solid ${color}35`, background: `${color}12`,
      fontFamily: "'IBM Plex Mono', monospace",
    }}>{label}</span>
  );
}

export function Rule({ T }) {
  return <div style={{ height: 1, background: T.border, margin: "0 0 52px" }} />;
}

export function SLabel({ children, T }) {
  return (
    <p style={{
      fontSize: 10, fontWeight: 700, letterSpacing: "0.16em",
      textTransform: "uppercase", color: T.accent, marginBottom: 8,
      fontFamily: "'IBM Plex Mono', monospace",
    }}>{children}</p>
  );
}

export function H2({ children, T }) {
  return (
    <h2 style={{
      fontSize: "clamp(22px,4vw,34px)", fontWeight: 700,
      color: T.text, letterSpacing: "-0.02em", marginBottom: 32,
      fontFamily: "'Space Grotesk', sans-serif",
    }}>{children}</h2>
  );
}

// ─── SVG ICONS ────────────────────────────────────────────────────────────────
export const IcYT = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
export const IcDrive = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4.433 22.396L0 15.036l4.433-7.643h8.867l4.433 7.643-4.433 7.36H4.433zm7.485-14.93L7.5 15.036h8.866l-4.448-7.57zM19.567 22.396l-2.216-3.781 6.649-11.52H19.567L15.134 0h4.433l6.433 11.15-6.433 11.246z"/>
  </svg>
);
export const IcGH = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);
export const IcLI = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
export const IcSwap = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4M7 4L3 8M7 4l4 4" />
    <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
  </svg>
);

// ─── ACTION BUTTON ────────────────────────────────────────────────────────────
export function ActionBtn({ icon, label, tooltip, active, activeColor, activeBg, activeBorder, T, onClick }) {
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
// Tilts in 3D toward the cursor (useTilt) and carries a soft radial highlight
// that follows the pointer, riding on the same --px/--py custom properties
// the tilt hook writes each frame.
export function ProjectCard({ project, T, categoryColors, fallbackGitHub, fallbackLinkedIn }) {
  const [hov, setHov] = useState(false);
  const { ref, onMouseMove, onMouseLeave } = useTilt(6);
  const tags     = (project.Tech_Stack || "").split(",").map(t => t.trim()).filter(Boolean);
  const catColor = categoryColors[project.Category] || T.accent;
  const open     = (url) => { if (url && url !== "#" && url !== "") window.open(url, "_blank", "noopener,noreferrer"); };

  const ghUrl = project.GitHub_Link && project.GitHub_Link.trim() !== ""
    ? project.GitHub_Link
    : fallbackGitHub;
  const liUrl = project.LinkedIn_Link && project.LinkedIn_Link.trim() !== ""
    ? project.LinkedIn_Link
    : fallbackLinkedIn;

  const BTNS = [
    { key:"yt",    label:"YouTube",   icon:<IcYT />,    url:project.YouTube_Link,  activeColor:"#ff0000", activeBg:"#ff000014", activeBorder:"#ff000035", tooltip:"Watch on YouTube" },
    { key:"drive", label:"Drive File",icon:<IcDrive />, url:project.Drive_Link,   activeColor:"#1fa463", activeBg:"#1fa46314", activeBorder:"#1fa46335", tooltip:"Open on Google Drive" },
    { key:"gh",    label:"GitHub",    icon:<IcGH />,    url:ghUrl,                activeColor:T.text,    activeBg:T.accentDim, activeBorder:T.border,    tooltip:"View on GitHub" },
    { key:"li",    label:"LinkedIn",  icon:<IcLI />,    url:liUrl,                activeColor:"#0a66c2", activeBg:"#0a66c214", activeBorder:"#0a66c235", tooltip:"View LinkedIn post" },
  ];

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); onMouseLeave(); }}
      onMouseMove={onMouseMove}
      style={{
        position: "relative", overflow: "hidden",
        background: hov ? T.cardHov : T.surface,
        border: `1px solid ${hov ? catColor + "45" : T.border}`,
        borderRadius: 12, padding: "20px 22px",
        transition: "background .2s, border-color .2s, transform .12s ease-out",
        display: "flex", flexDirection: "column", height: "100%",
        transformStyle: "preserve-3d", willChange: "transform",
        boxShadow: hov ? `0 18px 40px -18px ${catColor}55` : "0 0 0 rgba(0,0,0,0)",
      }}
    >
      {hov && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: `radial-gradient(220px circle at var(--px,50%) var(--py,50%), ${catColor}1c, transparent 70%)`,
        }} />
      )}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{
          fontSize:9, fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase",
          color:catColor, background:`${catColor}14`, border:`1px solid ${catColor}30`,
          padding:"2px 9px", borderRadius:5, fontFamily:"'IBM Plex Mono', monospace",
        }}>{project.Category}</span>
        {project.Metric && (
          <span style={{ fontSize:10, color:T.green, fontWeight:700 }}>✓ {project.Metric}</span>
        )}
      </div>

      <h3 style={{ color:T.text, fontSize:14, fontWeight:700, marginBottom:8, lineHeight:1.5, fontFamily:"'Space Grotesk', sans-serif" }}>
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
            fontFamily:"'IBM Plex Mono', monospace",
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
export function ThemeToggle({ dark, onToggle, T }) {
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

// ─── PROFILE SWITCH ───────────────────────────────────────────────────────────
// Fixed pill, top-left, that jumps between the Data Scientist and Data
// Engineer pages. Uses React Router Link so the whole app never full-reloads.
export function ProfileSwitch({ profileKey, T }) {
  const toDE = profileKey === "ds";
  const to = toDE ? "/data-engineer" : "/";
  const label = toDE ? "View as Data Engineer" : "View as Data Scientist";
  return (
    <Link
      to={to}
      style={{
        position:"fixed", top:20, left:20, zIndex:9998,
        display:"flex", alignItems:"center", gap:7,
        padding:"9px 16px", borderRadius:20,
        background:T.surface, border:`1px solid ${T.border}`,
        color:T.text, fontSize:12, fontWeight:700, textDecoration:"none",
        boxShadow:"0 2px 12px rgba(0,0,0,0.15)", transition:"all .2s",
        fontFamily:"'IBM Plex Mono', monospace",
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.text; }}
    >
      <IcSwap /> {label}
    </Link>
  );
}

// ─── CURSOR GLOW ──────────────────────────────────────────────────────────────
// Renders an absolutely-positioned radial-gradient div that reads the
// --mx/--my custom properties written by usePointerGlow on its parent. Must
// be a *child* of the ref'd element — it inherits the variables via CSS
// custom-property cascade, so no prop drilling or extra listeners needed.
export function CursorGlow({ T }) {
  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
      background: `radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), ${T.accentDim}, transparent 70%)`,
    }} />
  );
}
