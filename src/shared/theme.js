// ─── THEME TOKENS ─────────────────────────────────────────────────────────────
// Base tokens are shared between the Data Scientist and Data Engineer pages.
// Each profile then layers its own accent identity on top (see PROFILE_ACCENTS
// below) so the two pages read as related but distinct — same system, two signals.

export const DARK = {
  bg:          "#0a0b0d",
  surface:     "#131418",
  border:      "#22252b",
  text:        "#eef0f3",
  muted:       "#8b93a1",
  dim:         "#3f434c",
  green:       "#34d399",
  purple:      "#a78bfa",
  pink:        "#f472b6",
  cardHov:     "#181a1f",
  inputBg:     "#0a0b0d",
  scrollThumb: "#22252b",
};

export const LIGHT = {
  bg:          "#f6f7f9",
  surface:     "#ffffff",
  border:      "#e4e6eb",
  text:        "#0d0e10",
  muted:       "#6b7280",
  dim:         "#9ca3af",
  green:       "#059669",
  purple:      "#7c3aed",
  pink:        "#db2777",
  cardHov:     "#eef0f4",
  inputBg:     "#f9fafb",
  scrollThumb: "#d1d5db",
};

// Per-profile identity colour. The Data Scientist page reads as a cool signal
// (teal/cyan — model output, validation), the Data Engineer page as a warm
// signal (amber — pipelines, data-in-motion). Everything else about the two
// themes stays identical, so switching profiles feels like a costume change,
// not a different product.
export const PROFILE_ACCENTS = {
  ds: {
    dark:  { accent: "#2dd4bf", accentDim: "rgba(45,212,191,0.12)", accentSoft: "rgba(45,212,191,0.35)" },
    light: { accent: "#0d9488", accentDim: "rgba(13,148,136,0.10)", accentSoft: "rgba(13,148,136,0.30)" },
  },
  de: {
    dark:  { accent: "#f5a524", accentDim: "rgba(245,165,36,0.12)",  accentSoft: "rgba(245,165,36,0.35)"  },
    light: { accent: "#c2760a", accentDim: "rgba(194,118,10,0.10)",  accentSoft: "rgba(194,118,10,0.30)"  },
  },
};

export function getTheme(profileKey, dark) {
  const base = dark ? DARK : LIGHT;
  const accent = PROFILE_ACCENTS[profileKey][dark ? "dark" : "light"];
  return { ...base, ...accent };
}
