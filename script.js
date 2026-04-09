const REQUEST_TIMEOUT_MS = 8000;
const WEATHER_QUERY = [
  "current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
  "daily=weather_code,temperature_2m_max,temperature_2m_min",
  "forecast_days=3",
  "timezone=auto",
].join("&");
const DEFAULT_CITY_QUERY = "Manama";
const THEME_STORAGE_KEY = "weather-theme";
const FAVORITES_STORAGE_KEY = "weather-favorites";
const gulfCapitals = {
  manama: {
    name: "Manama, Bahrain",
    latitude: 26.2235,
    longitude: 50.5876,
  },
  riyadh: {
    name: "Riyadh, Saudi Arabia",
    latitude: 24.7136,
    longitude: 46.6753,
  },
  "kuwait-city": {
    name: "Kuwait City, Kuwait",
    latitude: 29.3759,
    longitude: 47.9774,
  },
  doha: {
    name: "Doha, Qatar",
    latitude: 25.2854,
    longitude: 51.531,
  },
  "abu-dhabi": {
    name: "Abu Dhabi, UAE",
    latitude: 24.4539,
    longitude: 54.3773,
  },
  muscat: {
    name: "Muscat, Oman",
    latitude: 23.588,
    longitude: 58.3829,
  },
};

const statusElement = document.getElementById("status");
const weatherContent = document.getElementById("weather-content");
const retryButton = document.getElementById("retry-button");
const themeToggle = document.getElementById("theme-toggle");
const saveFavoriteButton = document.getElementById("save-favorite-button");
const favoritesList = document.getElementById("favorites-list");
const forecastGrid = document.getElementById("forecast-grid");
const capitalSelect = document.getElementById("capital-select");
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const conditionElement = document.getElementById("condition");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
let lastRequestedLocation = {
  mode: "search",
  value: DEFAULT_CITY_QUERY,
  label: DEFAULT_CITY_QUERY,
};
let currentResolvedCity = null;
let favoriteCities = loadFavoriteCities();

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

function loadFavoriteCities() {
  try {
    const stored = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load favorite cities:", error);
    return [];
  }
}

function saveFavoriteCities() {
  window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favoriteCities));
}

function applyTheme(theme) {
  const isDarkMode = theme === "dark";
  document.body.classList.toggle("dark-mode", isDarkMode);
  themeToggle.textContent = isDarkMode ? "Light mode" : "Dark mode";
  themeToggle.setAttribute("aria-pressed", String(isDarkMode));
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function initializeTheme() {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  applyTheme(storedTheme === "dark" ? "dark" : "light");
}

function buildWeatherEndpoint(city) {
  return `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&${WEATHER_QUERY}`;
}

function buildGeocodingEndpoint(cityName) {
  const query = encodeURIComponent(cityName);
  return `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=en&format=json`;
}

function getCapitalByKey(capitalKey) {
  return gulfCapitals[capitalKey];
}

function formatForecastDay(dateString) {
  return new Date(dateString).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function renderForecast(daily) {
  if (!daily || !daily.time) {
    forecastGrid.innerHTML = "";
    return;
  }

  forecastGrid.innerHTML = daily.time
    .map((date, index) => {
      const condition =
        weatherCodeMap[daily.weather_code[index]] || "Condition unavailable";

      return `
        <article class="forecast-card">
          <span class="forecast-day">${formatForecastDay(date)}</span>
          <strong class="forecast-temp">${Math.round(daily.temperature_2m_max[index])}° / ${Math.round(daily.temperature_2m_min[index])}°</strong>
          <span class="forecast-condition">${condition}</span>
        </article>
      `;
    })
    .join("");
}

function renderFavorites() {
  if (favoriteCities.length === 0) {
    favoritesList.innerHTML = '<p class="empty-message">No favorite cities yet.</p>';
    return;
  }

  favoritesList.innerHTML = favoriteCities
    .map(
      (city) => `
        <div class="favorite-chip">
          <button class="favorite-button" type="button" data-city="${city}">${city}</button>
          <button class="favorite-remove" type="button" aria-label="Remove ${city}" data-remove-city="${city}">x</button>
        </div>
      `
    )
    .join("");
}

function showWeather(city, data) {
  const current = data.current;

  currentResolvedCity = city;
  locationElement.textContent = city.name;
  temperatureElement.textContent = `${Math.round(current.temperature_2m)}°C`;
  conditionElement.textContent =
    weatherCodeMap[current.weather_code] || "Condition unavailable";
  humidityElement.textContent = `${current.relative_humidity_2m}%`;
  windSpeedElement.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  renderForecast(data.daily);

  weatherContent.classList.remove("hidden");
  retryButton.classList.add("hidden");
  statusElement.classList.add("hidden");
}

function showError() {
  weatherContent.classList.add("hidden");
  retryButton.classList.remove("hidden");
  setStatus(
    `Unable to load weather for ${lastRequestedLocation.label} right now. Please check your input and try again.`,
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

async function loadWeather(request = lastRequestedLocation) {
  lastRequestedLocation = request;

  setStatus(`Loading current weather for ${request.label}...`);
  retryButton.classList.add("hidden");
  weatherContent.classList.add("hidden");
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const city =
      request.mode === "capital"
        ? getCapitalByKey(request.value)
        : await fetchCityCoordinates(request.value, controller);
    const payload = await fetchJson(buildWeatherEndpoint(city), controller);

    if (!payload.current || !payload.daily) {
      throw new Error("Weather response did not include current data");
    }

    showWeather(city, payload);
  } catch (error) {
    console.error(`Failed to load weather for ${request.label}:`, error);
    showError();
  } finally {
    window.clearTimeout(timeoutId);
  }
}

capitalSelect.addEventListener("change", () => {
  const selectedCapitalKey = capitalSelect.value;

  if (!selectedCapitalKey) {
    return;
  }

  const capital = getCapitalByKey(selectedCapitalKey);
  cityInput.value = capital.name;
  loadWeather({
    mode: "capital",
    value: selectedCapitalKey,
    label: capital.name,
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const submittedCity = cityInput.value.trim();

  if (!submittedCity) {
    setStatus("Please enter a city name before searching.", true);
    weatherContent.classList.add("hidden");
    retryButton.classList.add("hidden");
    return;
  }

  capitalSelect.value = "";
  loadWeather({
    mode: "search",
    value: submittedCity,
    label: submittedCity,
  });
});

retryButton.addEventListener("click", loadWeather);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
  applyTheme(nextTheme);
});

saveFavoriteButton.addEventListener("click", () => {
  if (!currentResolvedCity) {
    setStatus("Load a city first before saving it to favorites.", true);
    return;
  }

  if (favoriteCities.includes(currentResolvedCity.name)) {
    setStatus(`${currentResolvedCity.name} is already in your favorites.`, true);
    return;
  }

  favoriteCities = [...favoriteCities, currentResolvedCity.name];
  saveFavoriteCities();
  renderFavorites();
  setStatus(`${currentResolvedCity.name} saved to favorites.`);
});

favoritesList.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  const removeCity = target.dataset.removeCity;
  const selectedCity = target.dataset.city;

  if (removeCity) {
    favoriteCities = favoriteCities.filter((city) => city !== removeCity);
    saveFavoriteCities();
    renderFavorites();
    return;
  }

  if (selectedCity) {
    capitalSelect.value = "";
    cityInput.value = selectedCity;
    loadWeather({
      mode: "search",
      value: selectedCity,
      label: selectedCity,
    });
  }
});

cityInput.value = DEFAULT_CITY_QUERY;
initializeTheme();
renderFavorites();

loadWeather({
  mode: "search",
  value: DEFAULT_CITY_QUERY,
  label: DEFAULT_CITY_QUERY,
});
