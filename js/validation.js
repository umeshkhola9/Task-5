/* =============================================================
   VALIDATION.JS — Sochit Web Studio
   Real-time form validation for:
   - Contact form (#contact-form)
   - Quote modal form (#quote-modal)
   Each validator follows the same show/clear error pattern so
   behaviour is consistent across both forms.
   ============================================================= */

/* ---------------------------------------------------------------
   SHARED HELPERS
   --------------------------------------------------------------- */

/**
 * showError — marks an input as invalid and displays an error message.
 * @param {HTMLElement} input   — the form field
 * @param {string}      message — human-readable error text
 * @param {string}      errorId — id of the <span> that holds the error
 */
function showError(input, message, errorId) {
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = message;
    input.classList.add("input-error");
    input.classList.remove("input-valid");
    input.setAttribute("aria-invalid", "true");
}

/**
 * clearError — marks an input as valid and removes any error message.
 * @param {HTMLElement} input   — the form field
 * @param {string}      errorId — id of the <span> to clear
 */
function clearError(input, errorId) {
    const errEl = document.getElementById(errorId);
    if (errEl) errEl.textContent = "";
    input.classList.remove("input-error");
    input.classList.add("input-valid");
    input.setAttribute("aria-invalid", "false");
}

/* ---------------------------------------------------------------
   CONTACT FORM VALIDATION  (#contact-form)
   Validates name, email, optional phone, and message in real-time
   as the user types, plus on submit.
   --------------------------------------------------------------- */
function initFormValidation() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const nameInput    = document.getElementById("name");
    const emailInput   = document.getElementById("email");
    const phoneInput   = document.getElementById("phone");
    const messageInput = document.getElementById("message");
    const charCounter  = document.getElementById("char-counter");
    const MAX_MESSAGE  = 200;

    /* --- Individual field validators --- */

    function validateName() {
        const val = nameInput.value.trim();
        if (!val)         { showError(nameInput, "Name is required.", "name-error"); return false; }
        if (val.length < 3) { showError(nameInput, "Name must be at least 3 characters.", "name-error"); return false; }
        clearError(nameInput, "name-error");
        return true;
    }

    function validateEmail() {
        const val   = emailInput.value.trim();
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!val)          { showError(emailInput, "Email is required.", "email-error"); return false; }
        if (!regex.test(val)) { showError(emailInput, "Please enter a valid email address.", "email-error"); return false; }
        clearError(emailInput, "email-error");
        return true;
    }

    function validatePhone() {
        const val    = phoneInput.value.trim();
        if (!val) return true; /* phone is optional */
        const digits = val.replace(/\D/g, "");
        if (digits.length !== 10) {
            showError(phoneInput, "Phone number must be exactly 10 digits.", "phone-error");
            return false;
        }
        clearError(phoneInput, "phone-error");
        return true;
    }

    function validateMessage() {
        const val = messageInput.value.trim();
        if (!val) { showError(messageInput, "Message is required.", "message-error"); return false; }
        clearError(messageInput, "message-error");
        return true;
    }

    /* --- Real-time listeners --- */
    nameInput.addEventListener("input", validateName);
    emailInput.addEventListener("input", validateEmail);
    phoneInput.addEventListener("input", validatePhone);
    messageInput.addEventListener("input", validateMessage);

    /* --- Character counter for message textarea --- */
    if (charCounter) {
        messageInput.addEventListener("input", () => {
            const len = messageInput.value.length;
            charCounter.textContent = `${len} / ${MAX_MESSAGE} characters`;
            /* Warn when nearing the limit (≥90%) */
            charCounter.classList.toggle("counter-warning", len >= MAX_MESSAGE * 0.9);
        });
    }

    /* --- Submit handler --- */
    form.addEventListener("submit", e => {
        e.preventDefault();

        const valid = [validateName(), validateEmail(), validatePhone(), validateMessage()].every(Boolean);
        const status = document.getElementById("form-status");

        if (valid) {
            status.textContent = "✅ Thank you! Your message has been sent.";
            status.style.color = "green";
            form.reset();

            /* Reset character counter */
            if (charCounter) charCounter.textContent = `0 / ${MAX_MESSAGE} characters`;

            /* Remove validation state classes after reset */
            [nameInput, emailInput, phoneInput, messageInput].forEach(input => {
                input.classList.remove("input-valid");
                input.removeAttribute("aria-invalid");
            });
        } else {
            status.textContent = "❌ Please fix the errors above before submitting.";
            status.style.color = "red";

            /* Move focus to the first invalid field for keyboard users */
            const firstInvalid = form.querySelector("[aria-invalid='true']");
            if (firstInvalid) firstInvalid.focus();
        }

        /* Auto-clear status message after 5 seconds */
        setTimeout(() => { status.textContent = ""; }, 5000);
    });
}

/* ---------------------------------------------------------------
   QUOTE MODAL FORM VALIDATION  (#quote-modal)
   Validates name, email, and service selection on submit click.
   Closes the modal automatically on success.
   --------------------------------------------------------------- */
function initQuoteFormValidation() {
    const nameInput    = document.getElementById("quote-name");
    const emailInput   = document.getElementById("quote-email");
    const serviceInput = document.getElementById("quote-service");
    const submitBtn    = document.getElementById("quote-submit");
    const status       = document.getElementById("quote-status");

    if (!nameInput || !emailInput || !serviceInput || !submitBtn) return;

    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    /* Helper specific to quote form: also updates the status paragraph */
    function showQuoteError(input, message, errorId) {
        const errEl = document.getElementById(errorId);
        if (errEl) errEl.textContent = message;
        input.setAttribute("aria-invalid", "true");
        if (status) { status.textContent = message; status.style.color = "red"; }
    }

    function clearQuoteError(input, errorId) {
        const errEl = document.getElementById(errorId);
        if (errEl) errEl.textContent = "";
        input.removeAttribute("aria-invalid");
    }

    submitBtn.addEventListener("click", () => {
        const name    = nameInput.value.trim();
        const email   = emailInput.value.trim();
        const service = serviceInput.value;

        /* Clear previous errors before re-validating */
        clearQuoteError(nameInput,    "quote-name-error");
        clearQuoteError(emailInput,   "quote-email-error");
        clearQuoteError(serviceInput, "quote-service-error");

        if (name.length < 3) {
            showQuoteError(nameInput, "Please enter at least 3 characters for your name.", "quote-name-error");
            nameInput.focus();
            return;
        }
        if (!EMAIL_REGEX.test(email)) {
            showQuoteError(emailInput, "Please enter a valid email address.", "quote-email-error");
            emailInput.focus();
            return;
        }
        if (!service) {
            showQuoteError(serviceInput, "Please select a service.", "quote-service-error");
            serviceInput.focus();
            return;
        }

        /* Success: show confirmation and reset */
        if (status) { status.textContent = "✅ Quote request submitted successfully!"; status.style.color = "green"; }
        nameInput.value       = "";
        emailInput.value      = "";
        serviceInput.selectedIndex = 0;
        nameInput.removeAttribute("aria-invalid");
        emailInput.removeAttribute("aria-invalid");
        serviceInput.removeAttribute("aria-invalid");

        /* Close modal after brief success display */
        setTimeout(() => {
            const modal = document.getElementById("quote-modal");
            if (modal) {
                modal.classList.remove("open");
                modal.setAttribute("aria-hidden", "true");
            }
            document.body.style.overflow = "";
            if (status) status.textContent = "";
        }, 1000);
    });
}
