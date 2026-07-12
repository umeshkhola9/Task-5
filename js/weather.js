/* =============================================================
   WEATHER.JS — Sochit Web Studio
   Orchestrates the Weather Dashboard page:
   - Calls fetchWeatherData() from api.js
   - Persists the last searched city via storage.js
   - Updates DOM to show loading, error, or weather result
   Depends on: api.js, storage.js
   ============================================================= */

/* ---------------------------------------------------------------
   DOM REFERENCES  (declared once, reused throughout)
   --------------------------------------------------------------- */
const cityInput      = document.getElementById("city-input");
const searchBtn      = document.getElementById("search-btn");
const weatherLoading = document.getElementById("weather-loading");
const weatherError   = document.getElementById("weather-error");
const weatherResult  = document.getElementById("weather-result");

const cityNameEl     = document.getElementById("city-name");
const weatherDescEl  = document.getElementById("weather-desc");
const weatherIconEl  = document.getElementById("weather-icon");
const weatherTempEl  = document.getElementById("weather-temp");
const updatedEl      = document.getElementById("weather-updated");

const humidityEl     = document.getElementById("weather-humidity");
const windEl         = document.getElementById("weather-wind");
const feelsLikeEl    = document.getElementById("weather-feelslike");
const pressureEl     = document.getElementById("weather-pressure");
const visibilityEl   = document.getElementById("weather-visibility");
const sunriseEl      = document.getElementById("weather-sunrise");
const sunsetEl       = document.getElementById("weather-sunset");
const conditionEl    = document.getElementById("weather-condition");

/* ---------------------------------------------------------------
   DOM HELPERS
   --------------------------------------------------------------- */
function showEl(el) { el.classList.remove("hidden"); }
function hideEl(el) { el.classList.add("hidden"); }

/* ---------------------------------------------------------------
   TIME FORMATTING HELPERS
   --------------------------------------------------------------- */

/**
 * formatCityTime(unixSeconds, tzOffsetSeconds)
 * Converts a UTC unix timestamp from the API into the searched
 * city's local 12-hour time, using the city's UTC offset.
 * @param  {number} unixSeconds
 * @param  {number} tzOffsetSeconds
 * @returns {string} e.g. "6:42 AM"
 */
function formatCityTime(unixSeconds, tzOffsetSeconds) {
    const date    = new Date((unixSeconds + tzOffsetSeconds) * 1000);
    let hours     = date.getUTCHours();
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const ampm    = hours >= 12 ? "PM" : "AM";
    hours         = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

/**
 * formatNow()
 * Formats the current browser time for the "Last updated" label.
 * @returns {string} e.g. "6:42 AM"
 */
function formatNow() {
    const now     = new Date();
    let hours     = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm    = hours >= 12 ? "PM" : "AM";
    hours         = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
}

/* ---------------------------------------------------------------
   fetchWeather(city)
   Orchestrates the full search flow:
   1. Show loading indicator
   2. Call API (api.js)
   3. On success: render result and persist city
   4. On failure: show user-friendly error
   --------------------------------------------------------------- */
async function fetchWeather(city) {
    /* Reset UI state before each search */
    showEl(weatherLoading);
    hideEl(weatherError);
    hideEl(weatherResult);
    weatherError.textContent = "";

    try {
        const data = await fetchWeatherData(city);
        displayWeather(data);

        /* Persist city so it auto-loads on next visit */
        storageSet(STORAGE_KEYS.WEATHER_CITY, city.trim());
    } catch (err) {
        /* Map network errors to friendly messages */
        hideEl(weatherResult);
        weatherError.textContent =
            err.message === "Failed to fetch"
                ? "⚠️ Network error. Please check your internet connection."
                : `⚠️ ${err.message}`;
        showEl(weatherError);
    } finally {
        hideEl(weatherLoading);
    }
}

/* ---------------------------------------------------------------
   displayWeather(data)
   Populates the weather dashboard with data from the API.
   @param {Object} data — raw OpenWeatherMap response
   --------------------------------------------------------------- */
function displayWeather(data) {
    const { name, main, weather, wind, visibility, sys, timezone } = data;
    const icon = weather[0].icon;
    const desc = weather[0].description;
    const descCapitalised = desc.charAt(0).toUpperCase() + desc.slice(1);

    /* --- Header --- */
    cityNameEl.textContent    = `${name}, ${sys.country}`;
    weatherDescEl.textContent = descCapitalised;
    updatedEl.textContent     = `Last updated: ${formatNow()}`;

    /* --- Main temperature + icon --- */
    weatherTempEl.textContent = `${Math.round(main.temp)}°C`;
    weatherIconEl.src         = `https://openweathermap.org/img/wn/${icon}@4x.png`;
    weatherIconEl.alt         = descCapitalised;

    /* --- Detail cards --- */
    feelsLikeEl.textContent  = `${Math.round(main.feels_like)}°C`;
    humidityEl.textContent   = `${main.humidity}%`;
    windEl.textContent       = `${wind.speed} m/s`;
    pressureEl.textContent   = `${main.pressure} hPa`;
    visibilityEl.textContent = `${(visibility / 1000).toFixed(1)} km`;
    sunriseEl.textContent    = formatCityTime(sys.sunrise, timezone);
    sunsetEl.textContent     = formatCityTime(sys.sunset, timezone);
    conditionEl.textContent  = descCapitalised;

    showEl(weatherResult);
}

/* ---------------------------------------------------------------
   EVENT LISTENERS
   --------------------------------------------------------------- */

/* Search button click */
searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
});

/* Enter key in search input */
cityInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const city = cityInput.value.trim();
        if (city) fetchWeather(city);
    }
});

/* ---------------------------------------------------------------
   AUTO-LOAD LAST SEARCHED CITY
   Restores the previous city when the user returns to the page.
   --------------------------------------------------------------- */
window.addEventListener("DOMContentLoaded", () => {
    const lastCity = storageGet(STORAGE_KEYS.WEATHER_CITY);
    if (lastCity) {
        cityInput.value = lastCity;
        fetchWeather(lastCity);
    }
});
