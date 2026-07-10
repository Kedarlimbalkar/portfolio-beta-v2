import { useState, useEffect, useRef, useCallback } from "react";

// ─── SCROLL-REVEAL ────────────────────────────────────────────────────────────
export function useFadeIn() {
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

// ─── SCROLL SPY ───────────────────────────────────────────────────────────────
// Takes the nav array as a param so it can be reused across profiles that
// each define their own section order.
export function useScrollSpy(nav) {
  const [active, setActive] = useState(nav?.[0]?.id ?? "hero");
  useEffect(() => {
    const fn = () => {
      const mid = window.scrollY + window.innerHeight / 2;
      [...nav].reverse().forEach(({ id }) => {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= mid) setActive(id);
      });
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [nav]);
  return active;
}

// ─── POINTER GLOW ─────────────────────────────────────────────────────────────
// Attaches a mousemove listener to a ref'd element and writes the pointer
// position into --mx/--my CSS custom properties on that same element. Pure
// DOM writes, no React re-renders, so it stays smooth even on long pages.
export function usePointerGlow() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);
  return ref;
}

// ─── 3D TILT ──────────────────────────────────────────────────────────────────
// Returns DOM event handlers (not React state) so tilt tracks the mouse at
// full frame rate without triggering re-renders. Spread the returned handlers
// onto any element; it rotates in 3D toward the cursor and eases back to flat
// on mouse-leave. `strength` controls the max rotation in degrees.
export function useTilt(strength = 8) {
  const ref = useRef(null);

  const onMouseMove = useCallback(e => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;   // 0..1
    const py = (e.clientY - r.top) / r.height;   // 0..1
    const rx = (py - 0.5) * -2 * strength;
    const ry = (px - 0.5) *  2 * strength;
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    el.style.setProperty("--px", `${px * 100}%`);
    el.style.setProperty("--py", `${py * 100}%`);
  }, [strength]);

  const onMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
