const WEATHER_ENDPOINT =
  "https://api.open-meteo.com/v1/forecast?latitude=26.2235&longitude=50.5876&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";

const statusElement = document.getElementById("status");
const weatherContent = document.getElementById("weather-content");
const retryButton = document.getElementById("retry-button");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const conditionElement = document.getElementById("condition");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");

const weatherCodeMap = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with light hail",
  99: "Thunderstorm with heavy hail",
};

function setStatus(message, isError = false) {
  statusElement.textContent = message;
  statusElement.classList.toggle("error", isError);
  statusElement.classList.remove("hidden");
}

function showWeather(data) {
  locationElement.textContent = "Manama, Bahrain";
  temperatureElement.textContent = `${Math.round(data.temperature_2m)}°C`;
  conditionElement.textContent =
    weatherCodeMap[data.weather_code] || "Condition unavailable";
  humidityElement.textContent = `${data.relative_humidity_2m}%`;
  windSpeedElement.textContent = `${Math.round(data.wind_speed_10m)} km/h`;

  weatherContent.classList.remove("hidden");
  retryButton.classList.add("hidden");
  statusElement.classList.add("hidden");
}

function showError() {
  weatherContent.classList.add("hidden");
  retryButton.classList.remove("hidden");
  setStatus(
    "Unable to load Bahrain weather right now. Please check your connection and try again.",
    true
  );
}

async function loadWeather() {
  setStatus("Loading current weather...");
  retryButton.classList.add("hidden");
  weatherContent.classList.add("hidden");

  try {
    const response = await fetch(WEATHER_ENDPOINT);

    if (!response.ok) {
      throw new Error(`Weather request failed with status ${response.status}`);
    }

    const payload = await response.json();

    if (!payload.current) {
      throw new Error("Weather response did not include current data");
    }

    showWeather(payload.current);
  } catch (error) {
    console.error("Failed to load Bahrain weather:", error);
    showError();
  }
}

retryButton.addEventListener("click", loadWeather);

loadWeather();
