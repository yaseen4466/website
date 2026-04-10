const REQUEST_TIMEOUT_MS = 8000;
const WEATHER_QUERY = [
  "current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m",
  "daily=weather_code,temperature_2m_max,temperature_2m_min",
  "forecast_days=5",
  "timezone=auto",
].join("&");
const DEFAULT_CITY_QUERY = "Manama";
const THEME_STORAGE_KEY = "weather-theme";
const FAVORITES_STORAGE_KEY = "weather-favorites";
const LANGUAGE_STORAGE_KEY = "weather-language";
const API_LANGUAGE = "en";

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

const cityAliasMap = {
  manama: "Manama",
  "manama, bahrain": "Manama",
  المنامة: "Manama",
  "المنامة، البحرين": "Manama",
  riyadh: "Riyadh",
  "riyadh, saudi arabia": "Riyadh",
  الرياض: "Riyadh",
  "الرياض، السعودية": "Riyadh",
  doha: "Doha",
  "doha, qatar": "Doha",
  الدوحة: "Doha",
  "الدوحة، قطر": "Doha",
  muscat: "Muscat",
  "muscat, oman": "Muscat",
  مسقط: "Muscat",
  "مسقط، عمان": "Muscat",
  "kuwait city": "Kuwait City",
  "kuwait city, kuwait": "Kuwait City",
  الكويت: "Kuwait City",
  "مدينة الكويت": "Kuwait City",
  "مدينة الكويت، الكويت": "Kuwait City",
  "abu dhabi": "Abu Dhabi",
  "abu dhabi, uae": "Abu Dhabi",
  أبوظبي: "Abu Dhabi",
  "أبوظبي، الإمارات": "Abu Dhabi",
  "ابوظبي": "Abu Dhabi",
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
      "Choose a Gulf capital or search for a city to see current conditions, icons, and a 5-day forecast.",
    capitalLabel: "Quick Gulf capitals",
    capitalPlaceholder: "Select a Gulf capital",
    searchLabel: "Search for a city",
    searchPlaceholder: "Enter a city name",
    searchButton: "Search",
    favoritesTitle: "Favorite Cities",
    saveFavorite: "Save Current City",
    emptyFavorites: "No favorite cities yet.",
    loading: "Loading current weather for {city}...",
    suggestionsEmpty: "No matching city suggestions found.",
    detailsLabel: "Current weather details",
    humidity: "Humidity",
    windSpeed: "Wind Speed",
    forecastTitle: "5-Day Forecast",
    waiting: "Waiting for data",
    retry: "Try Again",
    footer: "Built by Yaseen Mohamed",
    error:
      "Unable to load weather for {city} right now. Please check your input and try again.",
    cityNotFound: "No weather results were found for {city}. Try the English city name instead.",
    arabicSearchHint:
      "This city was not recognized in Arabic. Try its English name or choose a Gulf capital.",
    requestFailed: "The weather service did not respond correctly. Please try again.",
    requestTimeout: "The weather request took too long. Please try again.",
    emptySearch: "Please enter a city name before searching.",
    saveFirst: "Load a city first before saving it to favorites.",
    alreadyFavorite: "{city} is already in your favorites.",
    savedFavorite: "{city} saved to favorites.",
    removeFavorite: "Remove {city}",
    alertHeat: "Extreme heat expected today.",
    alertCold: "Very cold conditions expected today.",
    alertWind: "Strong winds are active right now.",
    alertStorm: "Storm conditions detected. Take care outdoors.",
    alertRain: "Heavy rain conditions detected.",
  },
  ar: {
    title: "بحث الطقس للمدن",
    toolbar: "لوحة الطقس المحلية",
    themeDark: "الوضع الداكن",
    themeLight: "الوضع الفاتح",
    eyebrow: "الطقس المباشر",
    heroTitle: "ملخص طقس المدن",
    intro:
      "اختر عاصمة خليجية أو ابحث عن مدينة لمعرفة الطقس المباشر والأيقونات وتوقعات 5 أيام.",
    capitalLabel: "عواصم الخليج السريعة",
    capitalPlaceholder: "اختر عاصمة خليجية",
    searchLabel: "ابحث عن مدينة",
    searchPlaceholder: "اكتب اسم مدينة",
    searchButton: "بحث",
    favoritesTitle: "المدن المفضلة",
    saveFavorite: "حفظ المدينة الحالية",
    emptyFavorites: "لا توجد مدن مفضلة بعد.",
    loading: "جارٍ تحميل الطقس الحالي لـ {city}...",
    suggestionsEmpty: "لا توجد اقتراحات مطابقة لهذه المدينة.",
    detailsLabel: "تفاصيل الطقس الحالية",
    humidity: "الرطوبة",
    windSpeed: "سرعة الرياح",
    forecastTitle: "توقعات 5 أيام",
    waiting: "بانتظار البيانات",
    retry: "حاول مرة أخرى",
    footer: "تم التطوير بواسطة Yaseen Mohamed",
    error:
      "تعذر تحميل الطقس لـ {city} الآن. يرجى التحقق من الإدخال والمحاولة مرة أخرى.",
    cityNotFound: "لم يتم العثور على نتائج طقس للمدينة {city}. جرّب كتابة الاسم بالإنجليزية.",
    arabicSearchHint:
      "لم يتم التعرّف على هذه المدينة بالعربية. جرّب الاسم بالإنجليزية أو اختر عاصمة خليجية.",
    requestFailed: "خدمة الطقس لم تُرجع استجابة صحيحة. حاول مرة أخرى.",
    requestTimeout: "استغرق طلب الطقس وقتًا أطول من المتوقع. حاول مرة أخرى.",
    emptySearch: "من فضلك اكتب اسم مدينة قبل البحث.",
    saveFirst: "حمّل مدينة أولًا قبل حفظها في المفضلة.",
    alreadyFavorite: "{city} موجودة بالفعل في المفضلة.",
    savedFavorite: "تم حفظ {city} في المفضلة.",
    removeFavorite: "إزالة {city}",
    alertHeat: "هناك حرارة شديدة متوقعة اليوم.",
    alertCold: "هناك برودة شديدة متوقعة اليوم.",
    alertWind: "توجد رياح قوية حاليًا.",
    alertStorm: "تم رصد ظروف عاصفة. يرجى توخي الحذر خارج المنزل.",
    alertRain: "تم رصد أمطار غزيرة.",
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
const searchSuggestions = document.getElementById("search-suggestions");
const alertBanner = document.getElementById("alert-banner");
const capitalSelect = document.getElementById("capital-select");
const searchForm = document.getElementById("search-form");
const searchButton = document.getElementById("search-button");
const cityInput = document.getElementById("city-input");
const locationElement = document.getElementById("location");
const conditionIconElement = document.getElementById("condition-icon");
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
let suggestionDebounceId = null;
let suggestionsAbortController = null;

function isArabicText(value) {
  return /[\u0600-\u06FF]/.test(value);
}

function normalizeQueryValue(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/،/g, ",");
}

function mapCityNameToEnglish(cityName) {
  const normalized = normalizeQueryValue(cityName);
  return cityAliasMap[normalized] || null;
}

function resolveCityQuery(cityName) {
  const trimmedCity = cityName.trim();
  const mappedCity = mapCityNameToEnglish(trimmedCity);

  if (mappedCity) {
    return {
      query: mappedCity,
      originalLabel: trimmedCity,
      resolvedLabel: mappedCity,
    };
  }

  return {
    query: trimmedCity,
    originalLabel: trimmedCity,
    resolvedLabel: trimmedCity,
  };
}

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

function getWeatherIcon(code) {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if ([51, 53, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([95, 96, 99].includes(code)) return "⛈️";
  return "🌡️";
}

function getWeatherTheme(code) {
  if (code === 0) return "weather-clear";
  if (code === 1 || code === 2 || code === 3) return "weather-cloudy";
  if (code === 45 || code === 48) return "weather-fog";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "weather-rain";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "weather-snow";
  if ([95, 96, 99].includes(code)) return "weather-storm";
  return "weather-clear";
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

function applyWeatherTheme(code) {
  document.body.classList.remove(
    "weather-clear",
    "weather-cloudy",
    "weather-rain",
    "weather-storm",
    "weather-fog",
    "weather-snow"
  );
  document.body.classList.add(getWeatherTheme(code));
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
  return `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=${API_LANGUAGE}&format=json`;
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
      const code = daily.weather_code[index];
      const condition = localizeWeatherCode(code) || t("waiting");

      return `
        <article class="forecast-card">
          <span class="forecast-day">${formatForecastDay(date)}</span>
          <span class="forecast-icon" aria-hidden="true">${getWeatherIcon(code)}</span>
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

function hideSuggestions() {
  searchSuggestions.classList.add("hidden");
  searchSuggestions.innerHTML = "";
}

function renderSuggestions(results) {
  if (!results || results.length === 0) {
    searchSuggestions.innerHTML = `<p class="empty-message">${t("suggestionsEmpty")}</p>`;
    searchSuggestions.classList.remove("hidden");
    return;
  }

  searchSuggestions.innerHTML = results
    .map((result) => {
      const label = [result.name, result.country].filter(Boolean).join(", ");
      return `<button class="suggestion-item" type="button" data-city="${label}">${label}</button>`;
    })
    .join("");

  searchSuggestions.classList.remove("hidden");
}

function renderAlerts(current, daily) {
  const alerts = [];
  const todayMax = daily?.temperature_2m_max?.[0];
  const todayMin = daily?.temperature_2m_min?.[0];

  if (todayMax !== undefined && todayMax >= 40) {
    alerts.push(t("alertHeat"));
  }

  if (todayMin !== undefined && todayMin <= 0) {
    alerts.push(t("alertCold"));
  }

  if (current.wind_speed_10m >= 50) {
    alerts.push(t("alertWind"));
  }

  if ([95, 96, 99].includes(current.weather_code)) {
    alerts.push(t("alertStorm"));
  } else if ([65, 67, 82].includes(current.weather_code)) {
    alerts.push(t("alertRain"));
  }

  if (alerts.length === 0) {
    alertBanner.classList.add("hidden");
    alertBanner.textContent = "";
    return;
  }

  alertBanner.textContent = alerts.join(" • ");
  alertBanner.classList.remove("hidden");
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

  if (lastRequestedLocation.mode === "capital" && currentResolvedCity?.key) {
    lastRequestedLocation.label = getCapitalLabel(getCapitalByKey(currentResolvedCity.key));
  }

  if (currentResolvedCity) {
    if (currentResolvedCity.key) {
      currentResolvedCity.name = getCapitalLabel(getCapitalByKey(currentResolvedCity.key));
    }
    locationElement.textContent = currentResolvedCity.name;
    conditionElement.textContent = localizeWeatherCode(currentResolvedCity.weatherCode);
    conditionIconElement.textContent = getWeatherIcon(currentResolvedCity.weatherCode);
    renderForecast(currentResolvedCity.dailyForecast);
    renderAlerts(currentResolvedCity.currentWeather, currentResolvedCity.dailyForecast);
  }

  window.setTimeout(() => {
    document.body.classList.remove("is-language-switching");
  }, 340);
}

function showWeather(city, data) {
  const current = data.current;

  currentResolvedCity = {
    ...city,
    currentWeather: current,
    weatherCode: current.weather_code,
    dailyForecast: data.daily,
  };

  locationElement.textContent = city.name;
  conditionIconElement.textContent = getWeatherIcon(current.weather_code);
  temperatureElement.textContent = `${Math.round(current.temperature_2m)}°C`;
  conditionElement.textContent = localizeWeatherCode(current.weather_code) || t("waiting");
  humidityElement.textContent = `${current.relative_humidity_2m}%`;
  windSpeedElement.textContent = `${Math.round(current.wind_speed_10m)} km/h`;
  renderForecast(data.daily);
  renderAlerts(current, data.daily);
  applyWeatherTheme(current.weather_code);

  weatherContent.classList.remove("hidden");
  retryButton.classList.add("hidden");
  statusElement.classList.add("hidden");
}

function showError(message) {
  weatherContent.classList.add("hidden");
  retryButton.classList.remove("hidden");
  alertBanner.classList.add("hidden");
  setStatus(message || t("error", { city: lastRequestedLocation.label }), true);
}

async function fetchJson(url, controller) {
  console.log("[weather] API URL:", url);
  const response = await fetch(url, {
    signal: controller.signal,
  });

  console.log("[weather] Response status:", response.status, response.statusText);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const payload = await response.json();
  console.log("[weather] Response payload:", payload);
  return payload;
}

async function fetchCityCoordinates(cityName, controller, requestedLabel) {
  const payload = await fetchJson(buildGeocodingEndpoint(cityName), controller);

  if (!payload.results || payload.results.length === 0) {
    const notFoundError = new Error("City not found");
    notFoundError.code = "CITY_NOT_FOUND";
    notFoundError.requestedLabel = requestedLabel || cityName;
    throw notFoundError;
  }

  const [result] = payload.results;

  return {
    name: [result.name, result.country].filter(Boolean).join(", "),
    latitude: result.latitude,
    longitude: result.longitude,
  };
}

async function fetchCitySuggestions(cityName) {
  if (suggestionsAbortController) {
    suggestionsAbortController.abort();
  }

  suggestionsAbortController = new AbortController();
  const resolved = resolveCityQuery(cityName);
  const query = encodeURIComponent(resolved.query);
  const payload = await fetchJson(
    `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=${API_LANGUAGE}&format=json`,
    suggestionsAbortController
  );

  return payload.results || [];
}

async function loadWeather(request = lastRequestedLocation) {
  lastRequestedLocation = request;

  setStatus(t("loading", { city: request.label }));
  retryButton.classList.add("hidden");
  weatherContent.classList.add("hidden");
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    let city;

    if (request.mode === "capital") {
      const capital = getCapitalByKey(request.value);
      if (!capital) {
        throw new Error("Invalid capital selection");
      }

      console.log("[weather] Capital selected:", request.value, getCapitalLabel(capital));
      city = {
        ...capital,
        key: request.value,
        name: getCapitalLabel(capital),
      };
    } else {
      const resolvedRequest = resolveCityQuery(request.value);
      console.log("[weather] City name sent:", resolvedRequest.query);

      if (isArabicText(resolvedRequest.originalLabel) && !mapCityNameToEnglish(resolvedRequest.originalLabel)) {
        const arabicError = new Error("Arabic city not mapped");
        arabicError.code = "ARABIC_NOT_SUPPORTED";
        throw arabicError;
      }

      city = await fetchCityCoordinates(
        resolvedRequest.query,
        controller,
        resolvedRequest.originalLabel
      );

      const mappedLabel = mapCityNameToEnglish(request.value);
      if (mappedLabel) {
        city.name = currentLanguage === "ar" ? request.label : city.name;
      }
    }

    const payload = await fetchJson(buildWeatherEndpoint(city), controller);

    if (!payload.current || !payload.daily) {
      throw new Error("Weather response did not include current data");
    }

    showWeather(city, payload);
  } catch (error) {
    console.error(`Failed to load weather for ${request.label}:`, error);
    if (error.name === "AbortError") {
      showError(t("requestTimeout"));
      return;
    }

    if (error.code === "ARABIC_NOT_SUPPORTED") {
      showError(t("arabicSearchHint"));
      return;
    }

    if (error.code === "CITY_NOT_FOUND") {
      showError(t("cityNotFound", { city: error.requestedLabel || request.label }));
      return;
    }

    showError(t("requestFailed"));
  } finally {
    window.clearTimeout(timeoutId);
  }
}

capitalSelect.addEventListener("change", () => {
  const selectedCapitalKey = capitalSelect.value;

  if (!selectedCapitalKey) {
    return;
  }

  hideSuggestions();
  const capital = getCapitalByKey(selectedCapitalKey);
  const capitalName = getCapitalLabel(capital);
  const englishCapitalName = capital.name.en;
  cityInput.value = capitalName;
  console.log("[weather] Gulf capital mapped to English:", englishCapitalName);

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
  const resolvedRequest = resolveCityQuery(submittedCity);
  console.log("[weather] Search submitted:", {
    entered: submittedCity,
    mapped: resolvedRequest.query,
  });
  loadWeather({
    mode: "search",
    value: submittedCity,
    label: submittedCity,
  });
  hideSuggestions();
});

retryButton.addEventListener("click", loadWeather);

themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.classList.contains("dark-mode") ? "light" : "dark";
  applyTheme(nextTheme);
});

languageSelect.addEventListener("change", () => {
  animateLanguageSwitch(languageSelect.value);
  hideSuggestions();
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
    hideSuggestions();
    loadWeather({
      mode: "search",
      value: selectedCity,
      label: selectedCity,
    });
  }
});

cityInput.addEventListener("input", () => {
  const query = cityInput.value.trim();

  if (suggestionDebounceId) {
    window.clearTimeout(suggestionDebounceId);
  }

  if (query.length < 2) {
    hideSuggestions();
    return;
  }

  suggestionDebounceId = window.setTimeout(async () => {
    try {
      if (isArabicText(query) && !mapCityNameToEnglish(query)) {
        renderSuggestions([]);
        return;
      }

      const results = await fetchCitySuggestions(query);
      renderSuggestions(results);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to fetch search suggestions:", error);
      }
    }
  }, 220);
});

cityInput.addEventListener("blur", () => {
  window.setTimeout(hideSuggestions, 120);
});

searchSuggestions.addEventListener("click", (event) => {
  const target = event.target;

  if (!(target instanceof HTMLElement) || !target.dataset.city) {
    return;
  }

  const selectedCity = target.dataset.city;
  cityInput.value = selectedCity;
  hideSuggestions();
  capitalSelect.value = "";
  loadWeather({
    mode: "search",
    value: selectedCity,
    label: selectedCity,
  });
});

async function initializeApp() {
  cityInput.value = DEFAULT_CITY_QUERY;
  languageSelect.value = currentLanguage;
  updateStaticTranslations();
  initializeTheme();
  await loadWeather({
    mode: "search",
    value: DEFAULT_CITY_QUERY,
    label: currentLanguage === "ar" ? "المنامة" : DEFAULT_CITY_QUERY,
  });
}

initializeApp();
