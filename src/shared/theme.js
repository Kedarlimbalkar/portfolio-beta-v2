// theme.js — v3
// Same shape as v2 (DARK / LIGHT base + PROFILE_ACCENTS layered on top via
// getTheme), extended with a second accent stop per profile (`accent2`) and
// a couple of new tokens (`glow`, `glass`, `glassBorder`) that the bolder
// hero / card treatment needs. Nothing that already read T.accent, T.bg,
// etc. breaks — this is additive.

export const DARK = {
  bg: "#0c0c0a",
  surface: "#141412",
  border: "rgba(255,255,255,0.08)",
  text: "#f2f2ef",
  muted: "#9a9a92",
  dim: "#6b6b63",
  green: "#4ade80",
  purple: "#a78bfa",
  pink: "#f472b6",
  cardHov: "rgba(255,255,255,0.04)",
  inputBg: "rgba(255,255,255,0.03)",
  scrollThumb: "rgba(255,255,255,0.15)",
  glass: "rgba(20,20,18,0.55)",
  glassBorder: "rgba(255,255,255,0.10)",
};

export const LIGHT = {
  bg: "#FAFAF8",
  surface: "#ffffff",
  border: "rgba(18,18,13,0.08)",
  text: "#12120D",
  muted: "#68675E",
  dim: "#9a9990",
  green: "#16a34a",
  purple: "#7c3aed",
  pink: "#db2777",
  cardHov: "rgba(18,18,13,0.03)",
  inputBg: "rgba(18,18,13,0.02)",
  scrollThumb: "rgba(18,18,13,0.15)",
  glass: "rgba(255,255,255,0.60)",
  glassBorder: "rgba(18,18,13,0.08)",
};

// Each profile now carries a *pair* of colors (accent -> accent2) so we can
// build a real gradient (text, glow, scene) instead of a single flat hue.
// accent = darker/richer stop, accent2 = lighter/brighter stop.
export const PROFILE_ACCENTS = {
  ds: {
    dark: { accent: "#2dd4bf", accent2: "#67e8f9" }, // teal -> cyan
    light: { accent: "#0d9488", accent2: "#22d3ee" },
  },
  de: {
    dark: { accent: "#f5a524", accent2: "#fb923c" }, // amber -> orange
    light: { accent: "#c2760a", accent2: "#f97316" },
  },
};

export function getTheme(profileKey, dark) {
  const base = dark ? DARK : LIGHT;
  const accents = PROFILE_ACCENTS[profileKey] || PROFILE_ACCENTS.ds;
  const { accent, accent2 } = dark ? accents.dark : accents.light;
  return {
    ...base,
    dark,
    profileKey,
    accent,
    accent2,
    // convenience: pre-built gradient + soft glow color, used by the new
    // hero headline, buttons, and card hover glow
    accentGradient: `linear-gradient(100deg, ${accent}, ${accent2})`,
    glow: hexToRgba(accent, dark ? 0.28 : 0.22),
  };
}

function hexToRgba(hex, alpha) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
