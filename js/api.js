/* =============================================================
   API.JS — Sochit Web Studio
   Handles all external HTTP requests.
   Currently: OpenWeatherMap API for the Weather page.
   ============================================================= */

/* ---------------------------------------------------------------
   OPENWEATHERMAP CONFIGURATION
   --------------------------------------------------------------- */
const WEATHER_API_KEY = "26c6837c60b340e429683885d0209045";
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

/* ---------------------------------------------------------------
   fetchWeatherData()
   Fetches current weather for a given city name.
   Returns the parsed JSON data object on success, or throws an
   Error with a user-friendly message on failure.

   @param  {string} city  — city name entered by the user
   @returns {Promise<Object>} — raw OpenWeatherMap response object
   --------------------------------------------------------------- */
async function fetchWeatherData(city) {
    const url = `${WEATHER_BASE_URL}?q=${encodeURIComponent(city)}&appid=${WEATHER_API_KEY}&units=metric`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
        /* OpenWeatherMap returns { cod, message } on error */
        throw new Error(data.message || "City not found. Please try again.");
    }

    return data;
}
