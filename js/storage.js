/* =============================================================
   STORAGE.JS — Sochit Web Studio
   Thin wrappers around localStorage providing JSON
   serialisation, safe error handling, and a single location
   for all storage keys used across the site.
   ============================================================= */

/* ---------------------------------------------------------------
   STORAGE KEYS
   Centralised constants prevent typo-based bugs across modules.
   --------------------------------------------------------------- */
const STORAGE_KEYS = {
    THEME:       "theme",
    TODO_TASKS:  "sochitTodoTasks",
    WEATHER_CITY: "lastWeatherCity"
};

/* ---------------------------------------------------------------
   storageGet(key)
   Retrieves a value from localStorage and parses JSON if present.
   Returns null when the key does not exist or on parse error.

   @param  {string} key
   @returns {*} parsed value or null
   --------------------------------------------------------------- */
function storageGet(key) {
    try {
        const raw = localStorage.getItem(key);
        if (raw === null) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

/* ---------------------------------------------------------------
   storageSet(key, value)
   Serialises value as JSON and writes it to localStorage.

   @param {string} key
   @param {*}      value — any JSON-serialisable value
   --------------------------------------------------------------- */
function storageSet(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* Storage may be unavailable in private browsing; fail silently */
    }
}

/* ---------------------------------------------------------------
   storageRemove(key)
   Removes a key from localStorage.

   @param {string} key
   --------------------------------------------------------------- */
function storageRemove(key) {
    try {
        localStorage.removeItem(key);
    } catch {
        /* fail silently */
    }
}
