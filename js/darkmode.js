/* =============================================================
   DARKMODE.JS — Sochit Web Studio
   Manages dark / light theme toggle.
   Persists the user's preference in localStorage via storage.js.
   Depends on: storage.js (STORAGE_KEYS, storageGet, storageSet)
   ============================================================= */

/* ---------------------------------------------------------------
   initTheme()
   Reads the saved theme on page load, applies it to <html>, and
   attaches the click listener to the toggle button.
   --------------------------------------------------------------- */
function initTheme() {
    /* Default to "light" if no preference has been saved */
    const savedTheme = storageGet(STORAGE_KEYS.THEME) || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeBtn(savedTheme);

    const btn = document.getElementById("theme-toggle");
    if (btn) btn.addEventListener("click", toggleTheme);
}

/* ---------------------------------------------------------------
   updateThemeBtn(theme)
   Syncs the toggle button label and ARIA attributes to the
   current theme so keyboard and screen-reader users get
   meaningful feedback.

   @param {string} theme — "light" or "dark"
   --------------------------------------------------------------- */
function updateThemeBtn(theme) {
    const btn = document.getElementById("theme-toggle");
    if (!btn) return;

    const isDark = theme === "dark";
    btn.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
    btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    btn.setAttribute("aria-pressed", isDark ? "true" : "false");
}

/* ---------------------------------------------------------------
   toggleTheme()
   Flips the active theme and persists the new preference.
   --------------------------------------------------------------- */
function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    storageSet(STORAGE_KEYS.THEME, next);
    updateThemeBtn(next);
}
