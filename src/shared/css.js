// ─── CSS ──────────────────────────────────────────────────────────────────────
// Type system: Space Grotesk carries headlines (geometric, technical — reads
// like a diagram label blown up), IBM Plex Sans carries body copy, IBM Plex
// Mono carries anything numeric or tag-like (skills, stats, categories) —
// a nod to the terminal/notebook world this portfolio is representing.
export function getCSS(T) {
  return `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body, #root {
      width: 100%;
      min-height: 100vh;
      background: ${T.bg};
      overflow-x: hidden;
    }

    html { scroll-behavior: smooth; }
    body { margin: 0; padding: 0; }

    @media (prefers-reduced-motion: reduce) {
      html { scroll-behavior: auto; }
      *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
    }

    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: ${T.bg}; }
    ::-webkit-scrollbar-thumb { background: ${T.scrollThumb}; border-radius: 4px; }

    :focus-visible {
      outline: 2px solid ${T.accent};
      outline-offset: 2px;
    }

    .anim-1 { animation: up .6s ease both; }
    .anim-2 { animation: up .6s .1s ease both; }
    .anim-3 { animation: up .6s .2s ease both; }
    .anim-4 { animation: up .6s .3s ease both; }
    .anim-5 { animation: up .6s .4s ease both; }

    @keyframes up {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* Subtle hover lift for skill/project cards — the 3D tilt on project
       cards is handled inline via JS (useTilt), this covers everything else. */
    .glow-card { transition: transform .2s ease, border-color .2s ease; }
    .glow-card:hover { transform: translateY(-3px); border-color: ${T.accent}55 !important; }

    .hero-grid-perspective { perspective: 1200px; }

    @media (max-width: 720px) {
      .hero-grid { grid-template-columns: 1fr !important; text-align: center; }
      .hero-photo { order: -1; }
      .hero-btns  { justify-content: center; }
      .hero-stats { justify-content: center; }
      .two-col    { grid-template-columns: 1fr !important; }
    }
  `;
}
