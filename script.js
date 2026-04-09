const REQUEST_TIMEOUT_MS = 8000;
const WEATHER_QUERY =
  "current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto";
const DEFAULT_CITY_QUERY = "Manama";

const statusElement = document.getElementById("status");
const weatherContent = document.getElementById("weather-content");
const retryButton = document.getElementById("retry-button");
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const conditionElement = document.getElementById("condition");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
let lastSearchedCity = DEFAULT_CITY_QUERY;

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

function buildWeatherEndpoint(city) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&${WEATHER_QUERY}`;
}

function buildGeocodingEndpoint(cityName) {
  const query = encodeURIComponent(cityName);
  return `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`;
}

function showWeather(city, data) {
  locationElement.textContent = city.name;
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
    `Unable to load weather for ${lastSearchedCity} right now. Please check your city name and try again.`,
    true
  );
}

async function fetchJson(url, controller) {
  const response = await fetch(url, {
    signal: controller.signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

async function fetchCityCoordinates(cityName, controller) {
  const payload = await fetchJson(buildGeocodingEndpoint(cityName), controller);

  if (!payload.results || payload.results.length === 0) {
    throw new Error("City not found");
  }

  const [result] = payload.results;

  return {
    name: [result.name, result.country].filter(Boolean).join(", "),
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

async function loadWeather(cityName = lastSearchedCity) {
  const normalizedCityName = cityName.trim();
  lastSearchedCity = normalizedCityName || DEFAULT_CITY_QUERY;

  setStatus(`Loading current weather for ${lastSearchedCity}...`);
  retryButton.classList.add("hidden");
  weatherContent.classList.add("hidden");
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const city = await fetchCityCoordinates(lastSearchedCity, controller);
    const payload = await fetchJson(buildWeatherEndpoint(city), controller);

    if (!payload.current) {
      throw new Error("Weather response did not include current data");
    }

    showWeather(city, payload.current);
  } catch (error) {
    console.error(`Failed to load weather for ${lastSearchedCity}:`, error);
    showError();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const submittedCity = cityInput.value.trim();

  if (!submittedCity) {
    setStatus("Please enter a city name before searching.", true);
    weatherContent.classList.add("hidden");
    retryButton.classList.add("hidden");
    return;
  }

  loadWeather(submittedCity);
});

retryButton.addEventListener("click", loadWeather);

cityInput.value = DEFAULT_CITY_QUERY;

loadWeather(DEFAULT_CITY_QUERY);
