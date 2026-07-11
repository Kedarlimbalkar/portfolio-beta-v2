// Shared.jsx — v3
// Same export names/props as v2's spec. The one real visual change is
// ProjectCard: glass background, stronger 3D tilt via useTilt, and a
// cursor-following radial glow using --px/--py. Everything else
// (Reveal, Tag, Rule, SLabel, H2, icons, ActionBtn, ThemeToggle,
// ProfileSwitch, CursorGlow) is reconstructed to the same behavior
// described in HANDOFF_v2.md — if your real file has custom icon art,
// keep your existing icon components and only swap in the new
// ProjectCard / ActionBtn / CursorGlow below.

import React from "react";
import { Link } from "react-router-dom";
import { useFadeIn, useTilt, usePointerGlow } from "./hooks";

// ---------- layout atoms ----------

export function Reveal({ children, as: Tag_ = "div", style, ...rest }) {
  const { ref, visible } = useFadeIn();
  return (
    <Tag_
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag_>
  );
}

export function Tag({ children, color = "#888", style }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        letterSpacing: 0.6,
        padding: "4px 10px",
        borderRadius: 999,
        border: `1px solid ${color}55`,
        color,
        background: `${color}14`,
        ...style,
      }}
    >
      {children}
    </span>
  );
}

export function Rule({ style }) {
  return (
    <div
      style={{
        height: 1,
        width: "100%",
        background: "var(--rule, rgba(128,128,128,0.15))",
        ...style,
      }}
    />
  );
}

export function SLabel({ children, T, style }) {
  return (
    <div
      style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 12,
        letterSpacing: 2,
        textTransform: "uppercase",
        color: T?.accent || "#888",
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function H2({ children, T, style }) {
  return (
    <h2
      style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 700,
        fontSize: "clamp(28px, 4vw, 40px)",
        letterSpacing: "-0.01em",
        color: T?.text,
        margin: "0 0 24px",
        ...style,
      }}
    >
      {children}
    </h2>
  );
}

// ---------- icons (simple reconstructions — swap in your originals if
// you have distinct custom art) ----------

export const IcYT = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.9 3.6 12 3.6 12 3.6h0s-4.9 0-7.8.3c-.4 0-1.4.1-2.3 1C1.2 5.6 1 7.2 1 7.2S.8 9 .8 10.9v1.7c0 1.9.2 3.7.2 3.7s.2 1.6.9 2.3c.9.9 2.1.9 2.6 1 1.9.2 8 .3 8 .3s4.9 0 7.8-.3c.4 0 1.4-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.7v-1.7c0-1.9-.2-3.7-.2-3.7zM9.7 14.6V8.4l6.2 3.1-6.2 3.1z" />
  </svg>
);

export const IcDrive = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M7.7 2.8 1.3 14l3.4 5.9h6.9L18 8.7 14.5 2.8H7.7zm.9 1.8h4.8l2.6 4.4H5.9L8.6 4.6zM4.8 15.8 2.4 11.7l3-5.1 5.4 9.2H4.8zm7 2.3L8.2 12h9.1l-2 4.1H11.8z" />
  </svg>
);

export const IcGH = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2.1c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.5-.3-5.2-1.3-5.2-5.6 0-1.2.4-2.2 1.2-3-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.7.8 1.2 1.8 1.2 3 0 4.3-2.7 5.3-5.2 5.6.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A11.5 11.5 0 0 0 23.5 12c0-6.3-5.2-11.5-11.5-11.5z" />
  </svg>
);

export const IcLI = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" {...props}>
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM.5 8.98h4v14.02h-4V8.98zM8.5 8.98h3.83v1.92h.05c.53-1 1.84-2.06 3.79-2.06 4.05 0 4.8 2.67 4.8 6.14v8.02h-4v-7.11c0-1.7-.03-3.88-2.37-3.88-2.37 0-2.73 1.85-2.73 3.76v7.23h-4V8.98z" />
  </svg>
);

export const IcSwap = (props) => (
  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
    <path d="M7 16V4M7 4 3 8M17 8v12m0 0 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ---------- interactive pieces ----------

export function ActionBtn({ href, icon, children, primary, T, style, className }) {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "12px 22px",
    borderRadius: 12,
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    fontSize: 14.5,
    textDecoration: "none",
    border: `1px solid ${T?.border || "rgba(128,128,128,0.2)"}`,
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
    cursor: "pointer",
  };
  const primaryStyle = primary
    ? { background: T?.text, color: T?.bg, border: "none" }
    : {
        background: T?.glass || "transparent",
        color: T?.text,
        backdropFilter: "blur(8px)",
      };

  return (
    <a
      href={href}
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel="noreferrer"
      className={className}
      style={{ ...base, ...primaryStyle, ...style }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = `0 14px 30px -12px ${T?.glow || "rgba(0,0,0,0.3)"}`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {icon}
      {children}
    </a>
  );
}

export function ProjectCard({
  project,
  T,
  categoryColors = {},
}) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(9);
  const color = categoryColors[project.Category] || T?.accent;
  const stack = (project.Tech_Stack || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        position: "relative",
        borderRadius: 20,
        padding: 24,
        background: T?.glass,
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: `1px solid ${T?.glassBorder || T?.border}`,
        boxShadow: T?.dark
          ? "0 20px 60px -30px rgba(0,0,0,0.6)"
          : "0 20px 60px -30px rgba(18,18,13,0.25)",
        transition: "transform 0.15s ease-out, box-shadow 0.2s ease",
        overflow: "hidden",
        willChange: "transform",
      }}
      className="pcard"
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(240px circle at var(--px,50%) var(--py,50%), ${color}33, transparent 70%)`,
          opacity: 0,
          transition: "opacity 0.25s ease",
          pointerEvents: "none",
        }}
        className="pcard-glow"
      />
      {project.Category && (
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color,
            marginBottom: 10,
          }}
        >
          {project.Category}
        </div>
      )}
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: 20,
          color: T?.text,
          marginBottom: 6,
        }}
      >
        {project.Title}
      </div>
      {project.Metric && (
        <div style={{ fontSize: 13, fontWeight: 600, color, marginBottom: 12 }}>
          {project.Metric}
        </div>
      )}
      <div
        style={{
          fontSize: 14.5,
          lineHeight: 1.6,
          color: T?.muted,
          marginBottom: 16,
        }}
      >
        {project.Description}
      </div>
      {stack.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 18 }}>
          {stack.map((s) => (
            <Tag key={s} color={color}>
              {s}
            </Tag>
          ))}
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        {project.GitHub_Link && (
          <a
            href={project.GitHub_Link}
            target="_blank"
            rel="noreferrer"
            style={{ color: T?.muted }}
            aria-label="GitHub repository"
          >
            <IcGH />
          </a>
        )}
        {project.YouTube_Link && (
          <a href={project.YouTube_Link} target="_blank" rel="noreferrer" style={{ color: T?.muted }} aria-label="Demo video">
            <IcYT />
          </a>
        )}
        {project.Drive_Link && (
          <a href={project.Drive_Link} target="_blank" rel="noreferrer" style={{ color: T?.muted }} aria-label="Drive link">
            <IcDrive />
          </a>
        )}
        {project.LinkedIn_Link && (
          <a href={project.LinkedIn_Link} target="_blank" rel="noreferrer" style={{ color: T?.muted }} aria-label="LinkedIn post">
            <IcLI />
          </a>
        )}
      </div>
      <style>{`.pcard:hover .pcard-glow { opacity: 1; }`}</style>
    </div>
  );
}

export function ThemeToggle({ dark, onToggle, T }) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle theme"
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 50,
        width: 42,
        height: 42,
        borderRadius: "50%",
        border: `1px solid ${T?.border}`,
        background: T?.glass,
        backdropFilter: "blur(10px)",
        color: T?.text,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {dark ? "☀️" : "🌙"}
    </button>
  );
}

export function ProfileSwitch({ profileKey, T }) {
  const to = profileKey === "ds" ? "/data-engineer" : "/";
  const label = profileKey === "ds" ? "View as Data Engineer" : "View as Data Scientist";
  return (
    <Link
      to={to}
      style={{
        position: "fixed",
        top: 24,
        left: 24,
        zIndex: 50,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 18px",
        borderRadius: 999,
        border: `1px solid ${T?.border}`,
        background: T?.glass,
        backdropFilter: "blur(10px)",
        color: T?.text,
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 13,
        fontWeight: 500,
        textDecoration: "none",
      }}
    >
      <IcSwap /> {label}
    </Link>
  );
}

export function CursorGlow({ T }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: `radial-gradient(500px circle at var(--mx,50%) var(--my,50%), ${T?.glow || "rgba(120,120,120,0.15)"}, transparent 70%)`,
      }}
    />
  );
}