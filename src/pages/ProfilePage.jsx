// ProfilePage.jsx — v5
// v4 -> v5 changes (both requested by user, both use only real existing
// props — nothing invented):
//   1. ABOUT section is now a 2-column layout on wider screens: bio +
//      education cards stay on the left (unchanged), a new "Quick facts"
//      card + "Top skills" preview card sit on the right, vertically
//      aligned beside the education cards. Falls back to a single column
//      on narrow screens via auto-fit-style minmax grid.
//   2. EXPERIENCE section cards now render in a 2-column grid instead of
//      a single stacked column (falls back to 1 column on narrow screens).
//
// Real shapes used here (unchanged from v4):
//   NAV            [{ id, label }]              ids: hero/about/skills/projects/experience/contact
//   HERO_EYEBROW   string
//   HERO_TAGLINE   [line1, line2]                <- the big two-line name, NOT a sentence
//   HERO_SUB       string                        <- the actual tagline sentence
//   HERO_STATS     [[value, label], ...]         <- tuples, not {value,label} objects
//   EDUCATION      [{ deg, school, period, colorKey }]
//   SKILLS         { [categoryName]: [skill, ...] }   <- object map, not an array
//   PROJECTS       [{ id, Category, Title, Metric, Description, Tech_Stack (csv string),
//                      YouTube_Link, Drive_Link, GitHub_Link, LinkedIn_Link }]
//   EXPERIENCE     [{ role, company, period, colorKey, points: [string, ...] }]
//   CONTACT_LINE   string

import React, { useState } from "react";
import { getTheme } from "../shared/theme";
import { getCSS } from "../shared/css";
import NeuralField from "../shared/NeuralField";
import {
  Reveal,
  Tag,
  Rule,
  SLabel,
  H2,
  ActionBtn,
  ProjectCard,
  ThemeToggle,
  ProfileSwitch,
  CursorGlow,
  IcDrive,
} from "../shared/Shared";
import { usePointerGlow, useScrollSpy } from "../shared/hooks";

const COLOR_KEY_MAP = (T) => ({
  accent: T.accent,
  green: T.green,
  purple: T.purple,
  pink: T.pink,
});

export default function ProfilePage({
  profileKey,
  photoSrc,
  NAV = [],
  HERO_EYEBROW,
  HERO_TAGLINE = [],
  HERO_SUB,
  HERO_STATS = [],
  CV_FILE,
  ABOUT_PARAGRAPHS = [],
  EDUCATION = [],
  SKILLS = {},
  PROJECT_FILTERS = [],
  CATEGORY_COLOR_KEYS = {},
  PROJECTS = [],
  EXPERIENCE = [],
  CONTACT_LINE,
}) {
  const [dark, setDark] = useState(false);
  const T = getTheme(profileKey, dark);
  const colorMap = COLOR_KEY_MAP(T);
  const [filter, setFilter] = useState("All");
  const heroRef = usePointerGlow();
  useScrollSpy(NAV);

  const categoryColors = Object.fromEntries(
    Object.entries(CATEGORY_COLOR_KEYS).map(([cat, key]) => [cat, colorMap[key] || T.accent])
  );

  const visibleProjects =
    filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.Category === filter);

  const filters = PROJECT_FILTERS.includes("All")
    ? PROJECT_FILTERS
    : ["All", ...PROJECT_FILTERS];

  // Flatten SKILLS object map into a single preview list for the About
  // section's "Top skills" card — first 6 skills across all categories,
  // plus a "+N more" count pointing at the full Skills section.
  const allSkills = Object.values(SKILLS).flat();
  const previewSkills = allSkills.slice(0, 6);
  const remainingSkillsCount = Math.max(allSkills.length - previewSkills.length, 0);

  return (
    <div style={{ background: T.bg, color: T.text, minHeight: "100vh" }}>
      <style>{getCSS(T)}</style>

      <ThemeToggle dark={dark} onToggle={() => setDark((d) => !d)} T={T} />
      <ProfileSwitch profileKey={profileKey} T={T} />

      {/* ---------------- HERO ---------------- */}
      <section
        id="hero"
        ref={heroRef}
        className="hero-grid-perspective"
        style={{
          position: "relative",
          minHeight: "92vh",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          padding: "0 clamp(24px, 6vw, 72px)",
        }}
      >
        <NeuralField color={T.accent} color2={T.accent2} />
        <CursorGlow T={T} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 640 }}>
          {HERO_EYEBROW && (
            <div
              className="mono"
              style={{
                fontSize: 12,
                letterSpacing: 2,
                textTransform: "uppercase",
                color: T.accent,
                marginBottom: 22,
              }}
            >
              {HERO_EYEBROW}
            </div>
          )}

          <h1 className="hero-headline" style={{ margin: "0 0 26px", color: T.text }}>
            {HERO_TAGLINE[0]}
            <br />
            <span className="grad-text">{HERO_TAGLINE[1]}</span>
          </h1>

          {HERO_SUB && (
            <p style={{ fontSize: 17, color: T.muted, lineHeight: 1.6, maxWidth: 460, marginBottom: 34 }}>
              {HERO_SUB}
            </p>
          )}

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 48 }}>
            <ActionBtn href="#projects" primary T={T} className="magnetic-btn">
              View Projects
            </ActionBtn>
            {CV_FILE && (
              <ActionBtn href={CV_FILE} icon={<IcDrive />} T={T} className="magnetic-btn">
                Download CV
              </ActionBtn>
            )}
          </div>

          {HERO_STATS.length > 0 && (
            <div style={{ display: "flex", gap: 40, flexWrap: "wrap", borderTop: `1px solid ${T.border}`, paddingTop: 24 }}>
              {HERO_STATS.map(([value, label], i) => (
                <div key={i}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 26 }}>
                    {value}
                  </div>
                  <div style={{ fontSize: 13, color: T.muted }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {photoSrc && (
          <div
            style={{
              position: "absolute",
              right: "8%",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 1,
              width: 190,
              height: 190,
              borderRadius: "50%",
              overflow: "hidden",
              border: `4px solid ${T.glass}`,
              boxShadow: `0 30px 60px -20px ${T.glow}`,
            }}
          >
            <img src={photoSrc} alt="Kedar Limbalkar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        )}
      </section>

      {/* ---------------- NAV ---------------- */}
      {NAV.length > 0 && (
        <nav
          className="glass"
          style={{
            position: "sticky",
            top: 16,
            zIndex: 40,
            display: "flex",
            justifyContent: "center",
            gap: 28,
            margin: "0 auto 40px",
            width: "fit-content",
            padding: "12px 26px",
            borderRadius: 999,
          }}
        >
          {NAV.map((n) => (
            <a
              key={n.id}
              href={`#${n.id}`}
              className="mono"
              style={{ fontSize: 13, color: T.muted, textDecoration: "none" }}
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}

      {/* ---------------- ABOUT ---------------- */}
      {ABOUT_PARAGRAPHS.length > 0 && (
        <section id="about" style={{ padding: "60px clamp(24px, 6vw, 72px)", maxWidth: 1080, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.4fr) minmax(260px, 1fr)",
              gap: 40,
              alignItems: "start",
            }}
            className="about-grid"
          >
            {/* ----- Left column: bio + education (unchanged) ----- */}
            <div>
              <Reveal>
                <SLabel T={T}>About</SLabel>
                <H2 T={T}>Background</H2>
                {ABOUT_PARAGRAPHS.map((p, i) => (
                  <p key={i} style={{ color: T.muted, lineHeight: 1.75, marginBottom: 16 }}>
                    {p}
                  </p>
                ))}
              </Reveal>

              {EDUCATION.length > 0 && (
                <div style={{ marginTop: 40, display: "grid", gap: 16 }}>
                  {EDUCATION.map((e, i) => (
                    <Reveal key={i} className={`anim-${(i % 4) + 1}`}>
                      <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
                        <Tag color={colorMap[e.colorKey] || T.accent}>{e.period}</Tag>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, marginTop: 10 }}>
                          {e.deg}
                        </div>
                        <div style={{ color: T.muted, fontSize: 14 }}>{e.school}</div>
                      </div>
                    </Reveal>
                  ))}
                </div>
              )}
            </div>

            {/* ----- Right column: quick facts + top skills ----- */}
            <div style={{ display: "grid", gap: 16, marginTop: 4 }}>
              {(HERO_STATS.length > 0 || CONTACT_LINE || EXPERIENCE.length > 0) && (
                <Reveal className="anim-1">
                  <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
                    <div
                      className="mono"
                      style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: T.muted, marginBottom: 16 }}
                    >
                      Quick facts
                    </div>

                    {CONTACT_LINE && (
                      <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                        <div style={{ width: 4, borderRadius: 2, background: T.accent, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Status</div>
                          <div style={{ fontSize: 14, lineHeight: 1.4 }}>{CONTACT_LINE}</div>
                        </div>
                      </div>
                    )}

                    {EDUCATION.length > 0 && (
                      <div style={{ display: "flex", gap: 10, marginBottom: HERO_STATS.length > 0 ? 18 : 0 }}>
                        <div style={{ width: 4, borderRadius: 2, background: T.green || T.accent, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 11, color: T.muted, marginBottom: 2 }}>Currently</div>
                          <div style={{ fontSize: 14, lineHeight: 1.4 }}>{EDUCATION[0].deg} · {EDUCATION[0].school}</div>
                        </div>
                      </div>
                    )}

                    {HERO_STATS.length > 0 && (
                      <div
                        style={{
                          borderTop: `1px solid ${T.border}`,
                          paddingTop: 16,
                          display: "grid",
                          gridTemplateColumns: "repeat(2, 1fr)",
                          gap: 12,
                        }}
                      >
                        {HERO_STATS.map(([value, label], i) => (
                          <div key={i} style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 20 }}>
                              {value}
                            </div>
                            <div style={{ fontSize: 11, color: T.muted }}>{label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Reveal>
              )}

              {previewSkills.length > 0 && (
                <Reveal className="anim-2">
                  <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
                    <div
                      className="mono"
                      style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: T.muted, marginBottom: 14 }}
                    >
                      Top skills
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {previewSkills.map((s) => (
                        <Tag key={s} color={T.accent}>
                          {s}
                        </Tag>
                      ))}
                      {remainingSkillsCount > 0 && (
                        <a
                          href="#skills"
                          className="mono"
                          style={{
                            fontSize: 12,
                            padding: "5px 12px",
                            borderRadius: 999,
                            color: T.muted,
                            border: `1px solid ${T.border}`,
                            textDecoration: "none",
                          }}
                        >
                          +{remainingSkillsCount} more
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- SKILLS ---------------- */}
      {Object.keys(SKILLS).length > 0 && (
        <section id="skills" style={{ padding: "40px clamp(24px, 6vw, 72px)" }}>
          <Reveal>
            <SLabel T={T}>Skills</SLabel>
            <H2 T={T}>What I work with</H2>
          </Reveal>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
            {Object.entries(SKILLS).map(([category, items], i) => (
              <Reveal key={category} className={`anim-${(i % 4) + 1}`}>
                <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, marginBottom: 12 }}>
                    {category}
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {items.map((s) => (
                      <Tag key={s} color={T.accent}>
                        {s}
                      </Tag>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- PROJECTS ---------------- */}
      {PROJECTS.length > 0 && (
        <section id="projects" style={{ padding: "40px clamp(24px, 6vw, 72px)" }}>
          <Reveal>
            <SLabel T={T}>Projects</SLabel>
            <H2 T={T}>Selected work</H2>
          </Reveal>

          {filters.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 28 }}>
              {filters.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="mono"
                  style={{
                    padding: "8px 16px",
                    borderRadius: 999,
                    fontSize: 13,
                    cursor: "pointer",
                    border: `1px solid ${filter === f ? T.accent : T.border}`,
                    background: filter === f ? `${T.accent}1a` : "transparent",
                    color: filter === f ? T.accent : T.muted,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
            {visibleProjects.map((p) => (
              <Reveal key={p.id} className={`anim-${(p.id % 4) + 1}`}>
                <ProjectCard project={p} T={T} categoryColors={categoryColors} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- EXPERIENCE ---------------- */}
      {EXPERIENCE.length > 0 && (
        <section id="experience" style={{ padding: "40px clamp(24px, 6vw, 72px)", maxWidth: 1080, margin: "0 auto" }}>
          <Reveal>
            <SLabel T={T}>Experience</SLabel>
            <H2 T={T}>Where I've worked</H2>
          </Reveal>
          <div
            style={
              EXPERIENCE.length === 1
                ? { display: "flex", justifyContent: "center" }
                : { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 16 }
            }
            className="experience-grid"
          >
            {EXPERIENCE.map((e, i) => (
              <div key={i} style={EXPERIENCE.length === 1 ? { width: "100%", maxWidth: 560 } : undefined}>
                <Reveal className={`anim-${(i % 4) + 1}`}>
                  <div className="glass" style={{ borderRadius: 16, padding: 22, height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                      <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17 }}>
                        {e.role}
                      </div>
                      <Tag color={colorMap[e.colorKey] || T.accent}>{e.period}</Tag>
                    </div>
                    <div style={{ color: T.muted, fontSize: 14, marginTop: 4, marginBottom: 10 }}>
                      {e.company}
                    </div>
                    {Array.isArray(e.points) && e.points.length > 0 && (
                      <ul style={{ margin: 0, paddingLeft: 18, color: T.muted, lineHeight: 1.65, fontSize: 14.5 }}>
                        {e.points.map((pt, j) => (
                          <li key={j}>{pt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Reveal>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- CONTACT ---------------- */}
      <section id="contact" style={{ padding: "70px clamp(24px, 6vw, 72px) 90px", textAlign: "center" }}>
        <Rule style={{ maxWidth: 200, margin: "0 auto 40px" }} />
        <Reveal>
          <SLabel T={T} style={{ justifyContent: "center", display: "flex" }}>
            Contact
          </SLabel>
          <h2 className="grad-text" style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 5vw, 44px)", margin: "0 0 16px" }}>
            Let's talk
          </h2>
          {CONTACT_LINE && <p style={{ color: T.muted, marginBottom: 28 }}>{CONTACT_LINE}</p>}
          <ActionBtn href="mailto:kedar@example.com" primary T={T} className="magnetic-btn">
            Get in touch
          </ActionBtn>
        </Reveal>
      </section>

      {/* v5: responsive fallback — collapse About's 2-column grid to a
          single column on narrow viewports, since inline styles can't
          hold media queries. Experience grid already auto-fits via
          minmax and doesn't need this. */}
      <style>{`
        @media (max-width: 780px) {
          .about-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}