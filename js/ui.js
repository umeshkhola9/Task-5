/* =============================================================
   UI.JS — Sochit Web Studio
   General UI utilities used on every page:
   - Back To Top button
   - Smooth scrolling for anchor links
   - Todo filter button aria-pressed management
   ============================================================= */

/* ---------------------------------------------------------------
   BACK TO TOP BUTTON
   Shows the button when user scrolls past 300px, scrolls
   smoothly back to top and moves keyboard focus to #main-content.
   --------------------------------------------------------------- */
function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    /* Toggle .visible class on scroll (passive for performance) */
    window.addEventListener(
        "scroll",
        () => btn.classList.toggle("visible", window.scrollY > 300),
        { passive: true }
    );

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });

        /* Move keyboard focus to main landmark for accessibility */
        const main = document.getElementById("main-content");
        if (main) main.focus();
    });
}

/* ---------------------------------------------------------------
   SMOOTH SCROLLING
   Intercepts clicks on any in-page anchor link and scrolls
   smoothly to the target, also moving focus there.
   --------------------------------------------------------------- */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener("click", e => {
            const target = document.querySelector(link.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                target.focus({ preventScroll: true });
            }
        });
    });
}

/* ---------------------------------------------------------------
   TODO FILTER ARIA-PRESSED
   Keeps aria-pressed in sync when filter buttons are clicked.
   (The .active CSS class is handled inside todo.js; this only
   manages the ARIA attribute for screen readers.)
   --------------------------------------------------------------- */
function initTodoFilterAria() {
    const filterBtns = document.querySelectorAll(".todo-filter-btn");
    filterBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            filterBtns.forEach(b => b.setAttribute("aria-pressed", "false"));
            btn.setAttribute("aria-pressed", "true");
        });
    });
}
