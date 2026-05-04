// src/main.jsx
// ─────────────────────────────────────────────────────────
// IMPORTANT: index.css MUST be imported BEFORE App.jsx
// This ensures the full-screen reset applies globally first
// ─────────────────────────────────────────────────────────

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";          // ← full-screen reset (import first!)
import App from "./App.jsx";   // ← rename kedar-portfolio.jsx → App.jsx

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
