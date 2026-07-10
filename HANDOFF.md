# Kedar Portfolio — DE/DS Split — Handoff Doc

## Repo
https://github.com/Kedarlimbalkar/kedar-portfolio (React + Vite, plain inline-style
components, no CSS framework, no backend — contact form falls back to `mailto:`
unless EmailJS keys are filled in in `ProfilePage.jsx`).

## What was asked for
1. Portfolio currently only shows a Data Scientist profile (single page, all content
   in one giant `src/App.jsx`, ~890 lines).
2. User uploaded `Kedar_Limbalkar_DE.pdf` (Data Engineer resume) and asked to:
   - Add a Data Engineer version of the portfolio, with DE projects pulled from
     that resume (only GitHub links; YouTube/Drive/LinkedIn as placeholders).
   - Put Data Scientist and Data Engineer on **separate pages**.
   - Add "cool" cursor-reactive animation (something changes as you move the mouse).
   - Identify which files in the existing repo needed to change.

## What was done
Cloned the repo (`git clone https://github.com/Kedarlimbalkar/kedar-portfolio.git`),
fully refactored the single `App.jsx` into a shared-component + per-profile-data
architecture, added client-side routing with `react-router-dom`, and added a
cursor-tracking radial-gradient spotlight effect. Verified `npm install && npm run
build` succeeds with no errors.

### New files created
- `src/shared/theme.js` — `DARK` / `LIGHT` theme token objects (moved verbatim
  out of the old `App.jsx`).
- `src/shared/hooks.js` — `useFadeIn` (scroll-reveal), `useScrollSpy(nav)` (now
  takes the nav array as a param instead of a hardcoded module-level const),
  and new `usePointerGlow()` — attaches a `mousemove` listener to a ref'd
  element and writes `--mx` / `--my` CSS custom properties on it (no React
  re-renders, pure DOM writes for performance).
- `src/shared/Shared.jsx` — all the small reusable UI: `Reveal`, `Tag`, `Rule`,
  `SLabel`, `H2`, the 4 SVG icon components (`IcYT`, `IcDrive`, `IcGH`, `IcLI`),
  new `IcSwap`, `ActionBtn`, `ProjectCard` (now takes `categoryColors` and
  `fallbackGitHub`/`fallbackLinkedIn` as props instead of being hardcoded),
  `ThemeToggle`, new `ProfileSwitch` (fixed pill top-left, links between `/`
  and `/data-engineer`, uses React Router `Link`), new `CursorGlow` (renders
  the radial-gradient div that reads `var(--mx)`/`var(--my)` — must be
  rendered *inside* the element that has the `usePointerGlow` ref, since it
  relies on CSS custom-property inheritance, not its own mouse listener).
- `src/shared/css.js` — `getCSS(T)`, the global `<style>` string (fonts,
  scrollbar, `.anim-N` keyframes, responsive rules), moved out of `App.jsx`
  and stripped of the `dark` param (wasn't actually used by the original
  function body either).
- `src/data/dataScientist.js` — all DS content: `NAV`, `SKILLS`,
  `CATEGORY_COLOR_KEYS` (maps project Category string → theme color key, e.g.
  `ML: "accent"`), `PROJECTS` (all 10, unchanged from original), `EXPERIENCE`
  (now uses `colorKey` instead of a resolved `T.accent` value, since data
  files can't access `T` directly — resolved at render time in
  `ProfilePage.jsx`), `CV_FILE`, `HERO_TAGLINE`, `HERO_SUB`, `HERO_STATS`,
  `ABOUT_PARAGRAPHS`, `EDUCATION`, `CONTACT_LINE`, `PROJECT_FILTERS`.
- `src/data/dataEngineer.js` — same shape, new DE content sourced from
  `Kedar_Limbalkar_DE.pdf`:
  - **Skills**: pulled directly from the resume's "Technical Skills" section
    (languages, orchestration, databases, devops, data-quality practices,
    libraries).
  - **Projects** (3, `Category` is `ETL` or `Pipeline`):
    1. "Crypto ETL Pipeline" — CoinGecko API → Pandas → PostgreSQL, Airflow
       DAGs w/ retry logic, Dockerized. `GitHub_Link` = placeholder
       (`GITHUB_PLACEHOLDER = "https://github.com/Kedarlimbalkar"` constant
       at top of file) — **the resume PDF only had the word "GitHub" as a
       hyperlink label, the actual URL wasn't extractable from the PDF text,
       and I could not reach the GitHub API to list the user's repos (rate
       limited both unauthenticated and via the sandbox's shared IP) —
       needs the user to supply the real repo URL.**
    2. "Conversational AI for Retail — Data Pipeline" — same underlying
       project as the DS page's "Retail Conversational AI Agent" card, but
       reframed around the data-engineering pipeline (44,884 records, FAISS
       vector store, LangGraph). Also has the placeholder GitHub link — same
       problem, real URL unknown.
    3. "Emotion Recognition — Data & Inference Pipeline" — same underlying
       project as DS page's "Facial Emotion Recognition System". **This one
       I could confidently match to the existing known repo**
       `https://github.com/Kedarlimbalkar/facialRecog` (already used on the
       DS page for the same project), so its `GitHub_Link` is set correctly,
       not a placeholder.
    - YouTube/Drive/LinkedIn links are intentionally blank on all 3 DE
      projects, per the user's request — the corresponding action buttons
      auto-disable (greyed out, non-clickable) when a link is empty, exactly
      like the original `ProjectCard` behavior.
  - **Experience**: only the Intucate internship is on the DE resume (the
    AtliQ/Unified Mentor/NullClass internships from the DS resume are NOT on
    the DE resume, so they're correctly omitted here — this was intentional,
    not an oversight).
  - **CV_FILE**: `/Kedar_Limbalkar_DE.pdf` — this file was copied from
    `/mnt/user-data/uploads/Kedar_Limbalkar_DE.pdf` into the repo's
    `public/` folder so the "Download CV" button on the DE page works.
- `src/pages/ProfilePage.jsx` — the generic page template. Takes
  `profileKey` (`"ds"` or `"de"`, used only to decide which direction the
  `ProfileSwitch` pill points) plus all the named exports from a data file
  as props (spread via `{...DS}` / `{...DE}`), plus `photoSrc`. Contains all
  the section markup (hero/about/skills/projects/experience/contact/footer)
  that used to live directly in `App.jsx`'s `return`. Renders `<CursorGlow>`
  as the first child of the `usePointerGlow`-ref'd wrapper div, with a
  `position:relative, zIndex:1` inner wrapper around all actual content so
  the glow (zIndex:0) sits behind everything but the wrapper itself isn't
  `pointer-events:none` (only the glow div is), so clicks/hovers/inputs all
  still work normally.
- `src/pages/DataScientistPage.jsx` — `<ProfilePage profileKey="ds"
  photoSrc={KedarPhoto} {...DS} />`, where `DS = import * as DS from
  "../data/dataScientist"`.
- `src/pages/DataEngineerPage.jsx` — same pattern for DE.
- `public/Kedar_Limbalkar_DE.pdf` — copied from user's upload.

### Changed files
- `package.json` — added `"react-router-dom": "^7.1.1"` to `dependencies`.
- `src/App.jsx` — completely replaced. Used to contain ~890 lines of
  everything; now it's just:
  ```jsx
  import { Routes, Route } from "react-router-dom";
  import DataScientistPage from "./pages/DataScientistPage";
  import DataEngineerPage from "./pages/DataEngineerPage";

  export default function App() {
    return (
      <Routes>
        <Route path="/" element={<DataScientistPage />} />
        <Route path="/data-engineer" element={<DataEngineerPage />} />
        <Route path="*" element={<DataScientistPage />} />
      </Routes>
    );
  }
  ```
- `src/main.jsx` — wrapped the existing `<App />` render in
  `<BrowserRouter>` from `react-router-dom`. Everything else (StrictMode,
  `index.css` import order comment) preserved as-is.

### Files NOT changed
- `src/index.css`, `src/App.css` — untouched (App.css likely unused/dead
  since all styling is inline + the injected `<style>` tag from `getCSS`,
  same as before the refactor).
- `src/Kedar.jpeg`, `src/assets/*` — untouched.
- `vite.config.js`, `eslint.config.js`, `index.html` — untouched.
- `public/KEDAR_DS.pdf`, `public/Kedar_Limbalkar_DS.pdf`, `public/Kedar.JPEG`,
  favicon/sitemap files — untouched.

## The cursor animation, explained
This is the "as we move cursor some places change" effect the user asked
about. Implementation:
1. `usePointerGlow()` (in `shared/hooks.js`) returns a `ref`. Attach it to a
   wrapping div. A `mousemove` listener on that div computes the pointer's
   position relative to the div and writes it into two CSS custom
   properties on that same element: `--mx` and `--my` (in px).
2. `<CursorGlow T={T} />` (in `shared/Shared.jsx`) renders an absolutely
   positioned, `pointer-events:none` div with
   `background: radial-gradient(600px circle at var(--mx, 50%) var(--my, 50%), ${T.accentDim}, transparent 70%)`.
   Because it's a **child** of the ref'd element, it inherits the
   `--mx`/`--my` custom properties automatically (CSS custom properties
   cascade down the DOM tree) — no prop drilling, no re-renders on every
   mouse move.
3. Also added a `.glow-card` CSS class (in `shared/css.js`) applied to skill
   cards and project cards — currently just a hover lift
   (`transform: translateY(-3px)`), a hook is left in place for extending it
   to a per-card glow later if desired.
4. Both `ProfilePage.jsx` renders wire this up identically, so it works on
   both the DS and DE pages.

## Known gaps / follow-ups the user may still want
1. **DE project GitHub links** — 2 of 3 DE projects (Crypto ETL Pipeline,
   Conversational AI for Retail) have placeholder GitHub links pointing at
   the user's profile root, not the actual repo. Need the real repo URLs
   from the user, then edit `GITHUB_PLACEHOLDER` usages in
   `src/data/dataEngineer.js`.
2. **YouTube/Drive/LinkedIn links for DE projects** — all blank by design;
   fill in `YouTube_Link` / `Drive_Link` / `LinkedIn_Link` in
   `src/data/dataEngineer.js` per project once available.
3. EmailJS isn't configured (`YOUR_SERVICE_ID` etc. placeholders in
   `ProfilePage.jsx`) — this was already true before this change, contact
   form falls back to opening the user's mail client. Not something this
   task touched, just noting it's still open.
4. Build was verified locally in the sandbox (`npm install && npm run
   build` succeeded, 0 errors) but not visually/manually tested in a
   browser — worth a quick `npm run dev` check after merging, especially
   the cursor glow effect and mobile responsive layout (`@media
   (max-width: 720px)` rules in `shared/css.js`).
5. Did not attempt to push/commit to the actual GitHub repo — all work is
   local to this sandbox session, delivered as a file bundle for the user
   to copy into their local clone / PR themselves.

## How to apply these files
Copy the contents of the delivered `kedar-portfolio-changes/` folder over
the same relative paths in a fresh clone of
`Kedarlimbalkar/kedar-portfolio`, overwriting `package.json`, `src/App.jsx`,
and `src/main.jsx`, and adding the new `src/shared/`, `src/data/`,
`src/pages/` folders and `public/Kedar_Limbalkar_DE.pdf`. Then:
```
npm install
npm run dev     # sanity check locally
npm run build   # confirm production build still succeeds
```
