/* =============================================================
   SCRIPT.JS — Sochit Web Studio
   Main entry point. Imports no modules (plain JS for simplicity).
   Initialises all site-wide features on DOMContentLoaded.

   Load order in HTML (every page):
     storage.js → darkmode.js → ui.js → slider.js →
     validation.js → script.js

   Page-specific additions:
     weather.html: + api.js + weather.js
     todo.html:    + todo.js
   ============================================================= */

/* ---------------------------------------------------------------
   HAMBURGER MENU TOGGLE
   Opens/closes the mobile nav, managing ARIA attributes and
   closing on outside click or Escape key press.
   --------------------------------------------------------------- */
function initHamburger() {
    const hamburger = document.getElementById("hamburger");
    const navLinks  = document.querySelector(".nav-links");
    if (!hamburger || !navLinks) return;

    /* Helper to close the menu and reset ARIA */
    function closeMenu() {
        navLinks.classList.remove("nav-open");
        hamburger.classList.remove("active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Open navigation menu");
    }

    /* Toggle on hamburger click */
    hamburger.addEventListener("click", () => {
        const isOpen = navLinks.classList.toggle("nav-open");
        hamburger.classList.toggle("active", isOpen);
        hamburger.setAttribute("aria-expanded", String(isOpen));
        hamburger.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );
    });

    /* Close when any nav link is clicked (navigating away) */
    navLinks.querySelectorAll("a").forEach(link =>
        link.addEventListener("click", closeMenu)
    );

    /* Close on click outside the nav */
    document.addEventListener("click", e => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            closeMenu();
        }
    });

    /* Close on Escape key; return focus to hamburger button */
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && navLinks.classList.contains("nav-open")) {
            closeMenu();
            hamburger.focus();
        }
    });
}

/* ---------------------------------------------------------------
   MODAL POPUP  (quote dialog on Home & Services pages)
   Manages open/close, focus trapping, and Escape key dismissal.
   --------------------------------------------------------------- */
function initModal() {
    const modal = document.getElementById("quote-modal");
    if (!modal) return;

    const openBtns = document.querySelectorAll("[data-modal-open]");
    const closeBtn = modal.querySelector(".modal-close");
    const modalBox = modal.querySelector(".modal-box");
    let lastFocused = null;

    /* Focus trap: cycle through focusable elements inside the modal */
    function trapFocus(e) {
        const focusable = modalBox.querySelectorAll(
            'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last  = focusable[focusable.length - 1];

        if (e.key === "Tab") {
            if (e.shiftKey) {
                if (document.activeElement === first) { e.preventDefault(); last.focus(); }
            } else {
                if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
            }
        }
    }

    function openModal() {
        lastFocused = document.activeElement;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden"; /* prevent background scroll */
        closeBtn.focus();
        modal.addEventListener("keydown", trapFocus);
    }

    function closeModal() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        modal.removeEventListener("keydown", trapFocus);
        if (lastFocused) lastFocused.focus(); /* return focus to trigger */
    }

    openBtns.forEach(btn => btn.addEventListener("click", openModal));
    closeBtn.addEventListener("click", closeModal);

    /* Clicking the dark backdrop closes the modal */
    modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });

    /* Escape key closes the modal */
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    });
}

/* ---------------------------------------------------------------
   ANIMATED COUNTERS
   Uses IntersectionObserver to trigger the count animation
   only when the counter section scrolls into view.
   --------------------------------------------------------------- */
function initCounters() {
    const counters = document.querySelectorAll(".counter-number");
    if (counters.length === 0) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                /* Animate once per page load (data-animated flag) */
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = true;
                    animateCounter(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    counters.forEach(c => observer.observe(c));
}

/**
 * animateCounter(el)
 * Counts from 0 up to data-target over ~2 seconds.
 * Appends data-suffix (e.g. "+") when done.
 * @param {HTMLElement} el
 */
function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const suffix   = el.dataset.suffix || "";
    const duration = 2000; /* ms */
    const step     = target / (duration / 16); /* ~60fps */
    let current    = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        el.textContent = Math.floor(current) + suffix;
    }, 16);
}

/* ---------------------------------------------------------------
   INIT — run all features when the DOM is ready
   --------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
    initTheme();           /* darkmode.js */
    initHamburger();       /* script.js   */
    initBackToTop();       /* ui.js       */
    initSlider();          /* slider.js   */
    initModal();           /* script.js   */
    initFormValidation();  /* validation.js */
    initQuoteFormValidation(); /* validation.js */
    initSmoothScroll();    /* ui.js       */
    initCounters();        /* script.js   */
    initTodoFilterAria();  /* ui.js       */
});
