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
const LANGUAGE_STORAGE_KEY = "weather-language";

const gulfCapitals = {
  manama: {
    name: { en: "Manama, Bahrain", ar: "المنامة، البحرين" },
    latitude: 26.2235,
    longitude: 50.5876,
  },
  riyadh: {
    name: { en: "Riyadh, Saudi Arabia", ar: "الرياض، السعودية" },
    latitude: 24.7136,
    longitude: 46.6753,
  },
  "kuwait-city": {
    name: { en: "Kuwait City, Kuwait", ar: "مدينة الكويت، الكويت" },
    latitude: 29.3759,
    longitude: 47.9774,
  },
  doha: {
    name: { en: "Doha, Qatar", ar: "الدوحة، قطر" },
    latitude: 25.2854,
    longitude: 51.531,
  },
  "abu-dhabi": {
    name: { en: "Abu Dhabi, UAE", ar: "أبوظبي، الإمارات" },
    latitude: 24.4539,
    longitude: 54.3773,
  },
  muscat: {
    name: { en: "Muscat, Oman", ar: "مسقط، عمان" },
    latitude: 23.588,
    longitude: 58.3829,
  },
};

const translations = {
  en: {
    title: "City Weather Search",
    toolbar: "Local Weather Desk",
    themeDark: "Dark mode",
    themeLight: "Light mode",
    eyebrow: "Live Weather",
    heroTitle: "City Forecast Snapshot",
    intro:
      "Choose a Gulf capital or search for any city to see current conditions with temperature, humidity, wind, and a plain-language status.",
    capitalLabel: "Quick Gulf capitals",
    capitalPlaceholder: "Select a Gulf capital",
    searchLabel: "Search for a city",
    searchPlaceholder: "Enter a city name",
    searchButton: "Search",
    favoritesTitle: "Favorite Cities",
    saveFavorite: "Save Current City",
    emptyFavorites: "No favorite cities yet.",
    loading: "Loading current weather for {city}...",
    detailsLabel: "Current weather details",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    forecastTitle: "3-Day Forecast",
    waiting: "Waiting for data",
    retry: "Try Again",
    footer: "Built by Yaseen Mohamed",
    error:
      "Unable to load weather for {city} right now. Please check your input and try again.",
    emptySearch: "Please enter a city name before searching.",
    saveFirst: "Load a city first before saving it to favorites.",
    alreadyFavorite: "{city} is already in your favorites.",
    savedFavorite: "{city} saved to favorites.",
    removeFavorite: "Remove {city}",
  },
  ar: {
    title: "بحث الطقس للمدن",
    toolbar: "لوحة الطقس المحلية",
    themeDark: "الوضع الداكن",
    themeLight: "الوضع الفاتح",
    eyebrow: "الطقس المباشر",
    heroTitle: "ملخص طقس المدن",
    intro:
      "اختر عاصمة خليجية أو ابحث عن أي مدينة لمعرفة الطقس الحالي ودرجة الحرارة والرطوبة وسرعة الرياح ووصف الحالة.",
    capitalLabel: "عواصم الخليج السريعة",
    capitalPlaceholder: "اختر عاصمة خليجية",
    searchLabel: "ابحث عن مدينة",
    searchPlaceholder: "اكتب اسم مدينة",
    searchButton: "بحث",
    favoritesTitle: "المدن المفضلة",
    saveFavorite: "حفظ المدينة الحالية",
    emptyFavorites: "لا توجد مدن مفضلة بعد.",
    loading: "جارٍ تحميل الطقس الحالي لـ {city}...",
    detailsLabel: "تفاصيل الطقس الحالية",
    humidity: "الرطوبة",
    windSpeed: "سرعة الرياح",
    forecastTitle: "توقعات 3 أيام",
    waiting: "بانتظار البيانات",
    retry: "حاول مرة أخرى",
    footer: "تم التطوير بواسطة Yaseen Mohamed",
    error:
      "تعذر تحميل الطقس لـ {city} الآن. يرجى التحقق من الإدخال والمحاولة مرة أخرى.",
    emptySearch: "من فضلك اكتب اسم مدينة قبل البحث.",
    saveFirst: "حمّل مدينة أولًا قبل حفظها في المفضلة.",
    alreadyFavorite: "{city} موجودة بالفعل في المفضلة.",
    savedFavorite: "تم حفظ {city} في المفضلة.",
    removeFavorite: "إزالة {city}",
  },
};

const weatherCodeMap = {
  0: { en: "Clear sky", ar: "سماء صافية" },
  1: { en: "Mainly clear", ar: "صحو غالبًا" },
  2: { en: "Partly cloudy", ar: "غائم جزئيًا" },
  3: { en: "Overcast", ar: "غائم" },
  45: { en: "Fog", ar: "ضباب" },
  48: { en: "Depositing rime fog", ar: "ضباب متجمد" },
  51: { en: "Light drizzle", ar: "رذاذ خفيف" },
  53: { en: "Moderate drizzle", ar: "رذاذ متوسط" },
  55: { en: "Dense drizzle", ar: "رذاذ كثيف" },
  56: { en: "Light freezing drizzle", ar: "رذاذ متجمد خفيف" },
  57: { en: "Dense freezing drizzle", ar: "رذاذ متجمد كثيف" },
  61: { en: "Slight rain", ar: "أمطار خفيفة" },
  63: { en: "Moderate rain", ar: "أمطار متوسطة" },
  65: { en: "Heavy rain", ar: "أمطار غزيرة" },
  66: { en: "Light freezing rain", ar: "مطر متجمد خفيف" },
  67: { en: "Heavy freezing rain", ar: "مطر متجمد غزير" },
  71: { en: "Slight snow fall", ar: "ثلوج خفيفة" },
  73: { en: "Moderate snow fall", ar: "ثلوج متوسطة" },
  75: { en: "Heavy snow fall", ar: "ثلوج كثيفة" },
  77: { en: "Snow grains", ar: "حبوب ثلج" },
  80: { en: "Slight rain showers", ar: "زخات مطر خفيفة" },
  81: { en: "Moderate rain showers", ar: "زخات مطر متوسطة" },
  82: { en: "Violent rain showers", ar: "زخات مطر شديدة" },
  85: { en: "Slight snow showers", ar: "زخات ثلج خفيفة" },
  86: { en: "Heavy snow showers", ar: "زخات ثلج كثيفة" },
  95: { en: "Thunderstorm", ar: "عاصفة رعدية" },
  96: { en: "Thunderstorm with light hail", ar: "عاصفة رعدية مع برد خفيف" },
  99: { en: "Thunderstorm with heavy hail", ar: "عاصفة رعدية مع برد كثيف" },
};

const statusElement = document.getElementById("status");
const weatherContent = document.getElementById("weather-content");
const retryButton = document.getElementById("retry-button");
const themeToggle = document.getElementById("theme-toggle");
const languageSelect = document.getElementById("language-select");
const saveFavoriteButton = document.getElementById("save-favorite-button");
const favoritesList = document.getElementById("favorites-list");
const forecastGrid = document.getElementById("forecast-grid");
const capitalSelect = document.getElementById("capital-select");
const searchForm = document.getElementById("search-form");
const searchButton = document.getElementById("search-button");
const cityInput = document.getElementById("city-input");
const locationElement = document.getElementById("location");
const temperatureElement = document.getElementById("temperature");
const conditionElement = document.getElementById("condition");
const humidityElement = document.getElementById("humidity");
const windSpeedElement = document.getElementById("wind-speed");
const toolbarLabel = document.querySelector(".toolbar-label");
const eyebrowElement = document.querySelector(".eyebrow");
const weatherTitleElement = document.getElementById("weather-title");
const introElement = document.querySelector(".intro");
const capitalLabelElement = document.querySelector('label[for="capital-select"]');
const searchLabelElement = document.querySelector('label[for="city-input"]');
const favoritesTitleElement = document.getElementById("favorites-title");
const forecastTitleElement = document.getElementById("forecast-title");
const footerCreditElement = document.querySelector(".footer-credit");
const metricLabels = document.querySelectorAll(".metric-label");

let currentLanguage = loadLanguage();
let lastRequestedLocation = {
  mode: "search",
  value: DEFAULT_CITY_QUERY,
  label: DEFAULT_CITY_QUERY,
};
let currentResolvedCity = null;
let favoriteCities = loadFavoriteCities();

function t(key, values = {}) {
  const template = translations[currentLanguage][key] || translations.en[key] || "";

  return Object.entries(values).reduce((text, [name, value]) => {
    return text.replaceAll(`{${name}}`, value);
  }, template);
}

function localizeWeatherCode(code) {
  const condition = weatherCodeMap[code];
  return condition ? condition[currentLanguage] || condition.en : "";
}

function getCapitalLabel(capital) {
  return capital.name[currentLanguage] || capital.name.en;
}

function loadLanguage() {
  const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return storedLanguage === "ar" ? "ar" : "en";
}

function saveLanguage(language) {
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

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
  themeToggle.textContent = isDarkMode ? t("themeLight") : t("themeDark");
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
  return `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=${currentLanguage}&format=json`;
}

function getCapitalByKey(capitalKey) {
  return gulfCapitals[capitalKey];
}

function renderCapitalOptions() {
  const currentValue = capitalSelect.value;

  capitalSelect.innerHTML = [
    `<option value="">${t("capitalPlaceholder")}</option>`,
    ...Object.entries(gulfCapitals).map(([key, capital]) => {
      return `<option value="${key}">${getCapitalLabel(capital)}</option>`;
    }),
  ].join("");

  capitalSelect.value = currentValue;
}

function formatForecastDay(dateString) {
  return new Date(dateString).toLocaleDateString(currentLanguage === "ar" ? "ar" : "en", {
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
      const condition = localizeWeatherCode(daily.weather_code[index]) || t("waiting");

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
    favoritesList.innerHTML = `<p class="empty-message">${t("emptyFavorites")}</p>`;
    return;
  }

  favoritesList.innerHTML = favoriteCities
    .map((city) => {
      return `
        <div class="favorite-chip">
          <button class="favorite-button" type="button" data-city="${city}">${city}</button>
          <button class="favorite-remove" type="button" aria-label="${t("removeFavorite", { city })}" data-remove-city="${city}">x</button>
        </div>
      `;
    })
    .join("");
}

function updateStaticTranslations() {
  document.documentElement.lang = currentLanguage;
  document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
  document.body.style.setProperty(
    "--language-shift",
    currentLanguage === "ar" ? "-14px" : "14px"
  );

  document.title = t("title");
  toolbarLabel.textContent = t("toolbar");
  eyebrowElement.textContent = t("eyebrow");
  weatherTitleElement.textContent = t("heroTitle");
  introElement.textContent = t("intro");
  capitalLabelElement.textContent = t("capitalLabel");
  searchLabelElement.textContent = t("searchLabel");
  cityInput.placeholder = t("searchPlaceholder");
  cityInput.setAttribute("aria-label", t("searchPlaceholder"));
  searchButton.textContent = t("searchButton");
  favoritesTitleElement.textContent = t("favoritesTitle");
  saveFavoriteButton.textContent = t("saveFavorite");
  forecastTitleElement.textContent = t("forecastTitle");
  retryButton.textContent = t("retry");
  footerCreditElement.textContent = t("footer");
  weatherContent.setAttribute("aria-label", t("detailsLabel"));

  metricLabels[0].textContent = t("humidity");
  metricLabels[1].textContent = t("windSpeed");

  renderCapitalOptions();
  renderFavorites();
  applyTheme(document.body.classList.contains("dark-mode") ? "dark" : "light");

  if (!currentResolvedCity) {
    conditionElement.textContent = t("waiting");
  }
}

function animateLanguageSwitch(language) {
  currentLanguage = language;
  saveLanguage(language);
  document.body.classList.add("is-language-switching");
  updateStaticTranslations();

  if (currentResolvedCity) {
    if (currentResolvedCity.key) {
      currentResolvedCity.name = getCapitalLabel(getCapitalByKey(currentResolvedCity.key));
      currentResolvedCity.localizedName = currentResolvedCity.name;
      locationElement.textContent = currentResolvedCity.name;
    } else {
      locationElement.textContent = currentResolvedCity.localizedName || currentResolvedCity.name;
    }
    conditionElement.textContent = localizeWeatherCode(currentResolvedCity.weatherCode);
    renderForecast(currentResolvedCity.dailyForecast);
  }

  window.setTimeout(() => {
    document.body.classList.remove("is-language-switching");
  }, 340);
}

function showWeather(city, data) {
  const current = data.current;

  currentResolvedCity = {
    ...city,
    localizedName: city.name,
    weatherCode: current.weather_code,
    dailyForecast: data.daily,
  };

  locationElement.textContent = city.name;
  temperatureElement.textContent = `${Math.round(current.temperature_2m)}°C`;
  conditionElement.textContent = localizeWeatherCode(current.weather_code) || t("waiting");
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
  setStatus(t("error", { city: lastRequestedLocation.label }), true);
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

  setStatus(t("loading", { city: request.label }));
  retryButton.classList.add("hidden");
  weatherContent.classList.add("hidden");
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const city =
      request.mode === "capital"
        ? {
            ...getCapitalByKey(request.value),
            key: request.value,
            name: getCapitalLabel(getCapitalByKey(request.value)),
          }
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
  const capitalName = getCapitalLabel(capital);
  cityInput.value = capitalName;

  loadWeather({
    mode: "capital",
    value: selectedCapitalKey,
    label: capitalName,
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const submittedCity = cityInput.value.trim();

  if (!submittedCity) {
    setStatus(t("emptySearch"), true);
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

languageSelect.addEventListener("change", () => {
  animateLanguageSwitch(languageSelect.value);
});

saveFavoriteButton.addEventListener("click", () => {
  if (!currentResolvedCity) {
    setStatus(t("saveFirst"), true);
    return;
  }

  if (favoriteCities.includes(currentResolvedCity.name)) {
    setStatus(t("alreadyFavorite", { city: currentResolvedCity.name }), true);
    return;
  }

  favoriteCities = [...favoriteCities, currentResolvedCity.name];
  saveFavoriteCities();
  renderFavorites();
  setStatus(t("savedFavorite", { city: currentResolvedCity.name }));
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
languageSelect.value = currentLanguage;
updateStaticTranslations();
initializeTheme();

loadWeather({
  mode: "search",
  value: DEFAULT_CITY_QUERY,
  label: currentLanguage === "ar" ? "المنامة" : DEFAULT_CITY_QUERY,
});
