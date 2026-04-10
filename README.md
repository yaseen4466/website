# City Weather Search

A simple weather website built with HTML, CSS, and JavaScript that lets users search for a city or quickly choose a Gulf capital to view its current weather.

## Features

- Clean modern layout
- Current weather only
- City search input and search button
- Gulf capitals dropdown for quick selection
- 5-day forecast
- Weather icons for current conditions and forecast
- Dynamic background based on weather condition
- Weather alerts for extreme conditions
- Search suggestions while typing
- Dark mode toggle
- Arabic/English language switch with RTL support
- Favorite cities saved in the browser
- Displays location, temperature, condition, humidity, and wind speed
- Loading state while data is being fetched
- Error handling with a retry button when the weather request fails
- Invalid city-name handling
- Works when served from `localhost`

## Files

- `index.html` - page structure
- `styles.css` - styling and responsive layout
- `script.js` - geocoding lookup, city-name normalization, 5-day forecast logic, icons, and theme/favorites persistence

## Run Locally

Run the site from a local server so it opens through `localhost`.

### Option 1: Python 3

```bash
git clone https://github.com/yaseen4466/website.git
cd website
git checkout main
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000
```

### Option 2: Node.js

If you already have Node.js installed:

```bash
git clone https://github.com/yaseen4466/website.git
cd website
git checkout main
npx serve .
```

Open the localhost URL shown in the terminal.

## Expected Behavior

- The page first shows `Loading current weather...`
- Selecting a Gulf capital loads its weather directly
- Arabic Gulf capital names are normalized to English before calling the API
- After the API responds, the page shows the searched city's weather details
- The app also shows a 5-day forecast with weather icons
- Language switching between English and Arabic is saved in the browser
- Theme preference and favorite cities persist in `localStorage`
- If the city name is invalid, the page shows an error message
- If the request fails or times out, the page shows an error message and a `Try Again` button

## Weather Data

The app uses the Open-Meteo Geocoding API to find city coordinates and the Open-Meteo Forecast API for current weather data. No API key is required.
