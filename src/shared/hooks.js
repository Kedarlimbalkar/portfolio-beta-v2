// hooks.js — v3
// Unchanged from v2's spec. Reconstructed here only because the actual
// source wasn't available in this session — if your real hooks.js differs,
// keep yours; nothing else in this bundle depends on the internals here,
// only on the four exported names and their return shapes.

import { useEffect, useRef, useState } from "react";

// Scroll-reveal: adds a "visible" flag once the element enters the viewport.
export function useFadeIn(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.unobserve(el);
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

// Highlights the nav item matching whichever section is currently in view.
export function useScrollSpy(nav) {
  const [active, setActive] = useState(nav?.[0]?.id ?? null);

  useEffect(() => {
    if (!nav || nav.length === 0) return;
    const sections = nav
      .map((n) => document.getElementById(n.id))
      .filter(Boolean);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [nav]);

  return active;
}

// Writes --mx / --my custom properties on the ref'd element from a
// mousemove listener, without triggering React re-renders.
export function usePointerGlow() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--my", `${e.clientY - rect.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return ref;
}

// 3D tilt: writes a perspective/rotate transform directly to the DOM node
// (bypassing React state so it stays smooth), plus --px/--py for a
// cursor-following highlight. Eases back to flat on mouse-leave.
export function useTilt(strength = 10) {
  const ref = useRef(null);

  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (py - 0.5) * -strength;
    const ry = (px - 0.5) * strength;
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    el.style.setProperty("--px", `${px * 100}%`);
    el.style.setProperty("--py", `${py * 100}%`);
  };

  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0)";
  };

  return { ref, onMouseMove, onMouseLeave };
}
