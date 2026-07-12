/* =============================================================
   SLIDER.JS — Sochit Web Studio
   Image carousel / slider for the Home page gallery.
   Features: auto-play, prev/next buttons, dot indicators,
             keyboard arrow key support, touch/swipe support,
             ARIA live region announcements.
   ============================================================= */

/* ---------------------------------------------------------------
   initSlider()
   Bootstraps the carousel. Safe to call on pages without a
   .slider element — exits silently if no slider is found.
   --------------------------------------------------------------- */
function initSlider() {
    const slider = document.querySelector(".slider");
    if (!slider) return;

    const slides       = slider.querySelectorAll(".slide");
    const prevBtn      = slider.querySelector(".slider-prev");
    const nextBtn      = slider.querySelector(".slider-next");
    const dotsContainer = slider.querySelector(".slider-dots");
    const track        = slider.querySelector(".slides-track");

    let current = 0;
    let autoPlay;

    /* --- Build dot indicators dynamically --- */
    const dots = [];
    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className    = "slider-dot" + (i === 0 ? " active" : "");
        dot.setAttribute("role", "tab");
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        dot.setAttribute("aria-selected", i === 0 ? "true" : "false");
        dot.addEventListener("click", () => goTo(i));
        dotsContainer.appendChild(dot);
        dots.push(dot);
    });

    /* -------------------------------------------------------
       goTo(index)
       Transitions to the given slide index, wrapping around.
       Updates ARIA live region so screen readers announce the change.
       ------------------------------------------------------- */
    function goTo(index) {
        /* Deactivate current slide and dot */
        slides[current].classList.remove("active");
        dots[current].classList.remove("active");
        dots[current].setAttribute("aria-selected", "false");

        /* Wrap around and activate new slide */
        current = (index + slides.length) % slides.length;
        slides[current].classList.add("active");
        dots[current].classList.add("active");
        dots[current].setAttribute("aria-selected", "true");

        /* Update live region for screen reader announcements */
        if (track) {
            track.setAttribute(
                "aria-label",
                "Slide " + (current + 1) + " of " + slides.length
            );
        }
    }

    /* --- Auto-play helpers --- */
    function startAuto() {
        autoPlay = setInterval(() => goTo(current + 1), 4000);
    }

    function stopAuto() {
        clearInterval(autoPlay);
    }

    /* --- Button controls --- */
    prevBtn.addEventListener("click", () => { stopAuto(); goTo(current - 1); startAuto(); });
    nextBtn.addEventListener("click", () => { stopAuto(); goTo(current + 1); startAuto(); });

    /* --- Keyboard arrow key support --- */
    slider.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft")  { stopAuto(); goTo(current - 1); startAuto(); }
        if (e.key === "ArrowRight") { stopAuto(); goTo(current + 1); startAuto(); }
    });

    /* --- Touch / swipe support --- */
    let touchStartX = 0;

    slider.addEventListener(
        "touchstart",
        e => { touchStartX = e.touches[0].clientX; },
        { passive: true }
    );

    slider.addEventListener("touchend", e => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            stopAuto();
            goTo(current + (diff > 0 ? 1 : -1));
            startAuto();
        }
    });

    /* --- Initialise first slide and start auto-play --- */
    slides[0].classList.add("active");
    startAuto();
}
