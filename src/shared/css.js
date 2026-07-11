// css.js — v3
// getCSS(T) — same signature as v2. Kept the 3-role font system
// (Space Grotesk / IBM Plex Sans / IBM Plex Mono), pushed the display
// scale up for the bolder hero, and added a couple of reusable utility
// classes (.grad-text, .glass, .magnetic-btn) that the new hero /
// ProjectCard / ActionBtn lean on.

export function getCSS(T) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700;800&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      margin: 0;
      background: ${T.bg};
      color: ${T.text};
      font-family: 'IBM Plex Sans', sans-serif;
      -webkit-font-smoothing: antialiased;
    }

    ::selection { background: ${T.accent}33; }

    ::-webkit-scrollbar { width: 10px; }
    ::-webkit-scrollbar-thumb {
      background: ${T.scrollThumb};
      border-radius: 999px;
    }

    :focus-visible {
      outline: 2px solid ${T.accent};
      outline-offset: 2px;
    }

    h1, h2, h3 { font-family: 'Space Grotesk', sans-serif; }
    code, .mono { font-family: 'IBM Plex Mono', monospace; }

    .hero-headline {
      font-family: 'Space Grotesk', sans-serif;
      font-weight: 800;
      font-size: clamp(48px, 8vw, 96px);
      line-height: 0.98;
      letter-spacing: -0.02em;
    }

    .grad-text {
      background: ${T.accentGradient};
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .glass {
      background: ${T.glass};
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid ${T.glassBorder};
    }

    .hero-grid-perspective {
      perspective: 1400px;
    }

    .glow-card {
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .glow-card:hover {
      transform: translateY(-4px);
    }

    .magnetic-btn {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .magnetic-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 14px 30px -12px ${T.glow};
    }

    .anim-1 { animation-delay: 0.05s; }
    .anim-2 { animation-delay: 0.12s; }
    .anim-3 { animation-delay: 0.19s; }
    .anim-4 { animation-delay: 0.26s; }

    @media (max-width: 768px) {
      .hero-headline { font-size: clamp(38px, 12vw, 56px); }
    }

    @media (prefers-reduced-motion: reduce) {
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.001ms !important;
        scroll-behavior: auto !important;
      }
    }
  `;
}
