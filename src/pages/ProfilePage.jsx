import { useState } from "react";
import { getTheme } from "../shared/theme";
import { getCSS } from "../shared/css";
import { useScrollSpy, usePointerGlow } from "../shared/hooks";
import {
  Reveal, Tag, Rule, SLabel, H2, ProjectCard,
  ThemeToggle, ProfileSwitch, CursorGlow,
} from "../shared/Shared";
import NeuralField from "../shared/NeuralField";

// ─── EmailJS CONFIG — fill in your real keys from https://www.emailjs.com ─────
const EMAILJS_SERVICE_ID  = "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY  = "YOUR_PUBLIC_KEY";

export default function ProfilePage({
  profileKey, photoSrc,
  NAV, HERO_EYEBROW, HERO_TAGLINE, HERO_SUB, HERO_STATS, CV_FILE,
  ABOUT_PARAGRAPHS, EDUCATION, SKILLS, PROJECT_FILTERS, CATEGORY_COLOR_KEYS,
  PROJECTS, EXPERIENCE, CONTACT_LINE,
}) {
  const [dark, setDark] = useState(true);
  const T      = getTheme(profileKey, dark);
  const active = useScrollSpy(NAV);
  const glowRef = usePointerGlow();

  const [filter, setFilter] = useState("All");
  const [form,   setForm]   = useState({ name:"", email:"", message:"" });
  const [status, setStatus] = useState("");

  const filtered = filter === "All" ? PROJECTS : PROJECTS.filter(p => p.Category === filter);
  const categoryColors = Object.fromEntries(
    Object.entries(CATEGORY_COLOR_KEYS).map(([cat, key]) => [cat, T[key]])
  );

  const handleSubmit = async e => {
    e.preventDefault();
    const emailjsReady =
      EMAILJS_SERVICE_ID  !== "YOUR_SERVICE_ID" &&
      EMAILJS_TEMPLATE_ID !== "YOUR_TEMPLATE_ID" &&
      EMAILJS_PUBLIC_KEY  !== "YOUR_PUBLIC_KEY";

    if (!emailjsReady) {
      const subject = encodeURIComponent(`Portfolio Contact from ${form.name}`);
      const body    = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
      window.location.href = `mailto:kedarlimbalkar@gmail.com?subject=${subject}&body=${body}`;
      setStatus("ok");
      setForm({ name:"", email:"", message:"" });
      return;
    }

    setStatus("sending");
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
    transition:"border-color .18s", fontFamily:"'IBM Plex Sans', sans-serif",
  };

  return (
    <>
      <style>{getCSS(T)}</style>
      <ThemeToggle dark={dark} onToggle={() => setDark(d => !d)} T={T} />
      <ProfileSwitch profileKey={profileKey} T={T} />

      <div style={{
        minHeight:"100vh", width:"100%", background:T.bg, color:T.text,
        fontFamily:"'IBM Plex Sans', sans-serif", overflowX:"hidden",
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
              fontFamily:"'IBM Plex Sans', sans-serif",
            }}>{label}</button>
          ))}
        </nav>

        {/* ════════ HERO ════════ */}
        <section
          id="hero"
          ref={glowRef}
          className="hero-grid-perspective"
          style={{
            position:"relative", minHeight:"100vh",
            display:"flex", alignItems:"center", justifyContent:"center",
            padding:"80px 48px 120px", overflow:"hidden",
          }}
        >
          <NeuralField color={T.accent} nodeCount={60} />
          <CursorGlow T={T} />

          <div className="hero-grid" style={{
            position:"relative", zIndex:1,
            maxWidth:1100, width:"100%", margin:"0 auto",
            display:"grid", gridTemplateColumns:"1fr 260px",
            gap:64, alignItems:"center",
          }}>
            {/* LEFT */}
            <div>
              <p className="anim-1" style={{
                fontSize:10, fontWeight:700, letterSpacing:"0.18em",
                textTransform:"uppercase", color:T.accent, marginBottom:20,
                fontFamily:"'IBM Plex Mono', monospace",
              }}>{HERO_EYEBROW}</p>

              <h1 className="anim-2" style={{
                fontSize:"clamp(42px,7vw,80px)", fontWeight:700,
                lineHeight:1.02, letterSpacing:"-0.03em", color:T.text,
                marginBottom:20, fontFamily:"'Space Grotesk', sans-serif",
              }}>
                {HERO_TAGLINE[0]}<br />
                <span style={{ color:T.accent }}>{HERO_TAGLINE[1]}</span>
              </h1>

              <p className="anim-3" style={{
                color:T.muted, fontSize:15, lineHeight:1.8, maxWidth:460, marginBottom:30,
              }}>
                {HERO_SUB}
              </p>

              <div className="anim-4 hero-btns" style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                <button onClick={() => go("projects")} style={{
                  padding:"11px 28px", borderRadius:9,
                  background:T.accent, color:"#0a0b0d",
                  fontSize:13, fontWeight:700, border:"none", cursor:"pointer",
                  transition:"opacity .18s", fontFamily:"'IBM Plex Sans', sans-serif",
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
                  onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                >View Projects</button>

                <a
                  href={CV_FILE}
                  download
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
                {HERO_STATS.map(([n,l]) => (
                  <div key={l}>
                    <div style={{ fontSize:24, fontWeight:700, color:T.text, letterSpacing:"-0.02em", fontFamily:"'Space Grotesk', sans-serif" }}>{n}</div>
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
                boxShadow:`0 0 60px ${T.accentDim}`,
              }}>
                <img
                  src={photoSrc}
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
                {ABOUT_PARAGRAPHS.map((p, i) => (
                  <p key={i} style={{ color:T.muted, fontSize:14, lineHeight:1.85, marginBottom: i === ABOUT_PARAGRAPHS.length - 1 ? 0 : 18 }}>
                    {p}
                  </p>
                ))}
              </Reveal>

              <Reveal delay={0.1}>
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {EDUCATION.map(e => (
                    <div key={e.deg} className="glow-card" style={{
                      padding:"16px 18px", borderRadius:9,
                      background:T.surface, border:`1px solid ${T.border}`,
                    }}>
                      <div style={{ fontSize:13, fontWeight:700, color:T.text, marginBottom:3 }}>{e.deg}</div>
                      <div style={{ fontSize:12, color:T[e.colorKey] }}>{e.school}</div>
                      <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>{e.period}</div>
                    </div>
                  ))}
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
                  <div className="glow-card" style={{
                    background:T.bg, border:`1px solid ${T.border}`,
                    borderRadius:9, padding:"18px",
                  }}>
                    <p style={{
                      fontSize:10, fontWeight:700, letterSpacing:"0.12em",
                      textTransform:"uppercase", color:T.accent, marginBottom:12,
                      fontFamily:"'IBM Plex Mono', monospace",
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

            <Reveal delay={0.04}>
              <div style={{ display:"flex", gap:8, marginBottom:28, flexWrap:"wrap" }}>
                {PROJECT_FILTERS.map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    padding:"6px 16px", borderRadius:7, fontSize:12, fontWeight:600,
                    border:`1px solid ${filter === f ? T.accent : T.border}`,
                    background: filter === f ? T.accentDim : "none",
                    color: filter === f ? T.accent : T.muted,
                    cursor:"pointer", transition:"all .15s",
                    fontFamily:"'IBM Plex Sans', sans-serif",
                  }}>{f}</button>
                ))}
              </div>
            </Reveal>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:14 }}>
              {filtered.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.06}>
                  <ProjectCard
                    project={p} T={T}
                    categoryColors={categoryColors}
                    fallbackGitHub="https://github.com/Kedarlimbalkar"
                    fallbackLinkedIn="https://www.linkedin.com/in/kedar-limbalkar/"
                  />
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
                    borderLeft:`3px solid ${T[exp.colorKey]}`,
                    borderRadius:"0 9px 9px 0", padding:"18px 24px",
                    transition:"background .3s",
                  }}>
                    <div style={{ display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:8, marginBottom:10 }}>
                      <div>
                        <span style={{ color:T.text, fontWeight:700, fontSize:14 }}>{exp.role}</span>
                        <span style={{ color:T[exp.colorKey], fontSize:13, marginLeft:8, fontWeight:600 }}>{exp.company}</span>
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
              <p style={{ color:T.muted, fontSize:14, lineHeight:1.75, marginBottom:16 }}>
                {CONTACT_LINE}
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
                  background:T.accent, color:"#0a0b0d",
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
              <div style={{ fontWeight:700, fontSize:14, color:T.text, fontFamily:"'Space Grotesk', sans-serif" }}>Kedar Limbalkar</div>
              <div style={{ fontSize:11, color:T.muted, marginTop:2 }}>ML Engineer · Data Scientist · Data Engineer · Pune, MH</div>
            </div>
            <div style={{ display:"flex", gap:20 }}>
              {[
                ["LinkedIn","https://www.linkedin.com/in/kedar-limbalkar/"],
                ["GitHub",  "https://github.com/kedarlimbalkar"],
                ["Email",   "mailto:kedarlimbalkar@gmail.com"],
                ["Phone",   "tel:9284374129"],
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
