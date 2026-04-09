# Gulf Capitals Weather Site

A simple weather website built with HTML, CSS, and JavaScript that shows the current weather for major Gulf capitals.

## Features

- Clean modern layout
- Current weather only
- Dropdown menu for Gulf capitals
- Displays location, temperature, condition, humidity, and wind speed
- Loading state while data is being fetched
- Error handling with a retry button when the weather request fails
- Works when served from `localhost`

## Files

- `index.html` - page structure
- `styles.css` - styling and responsive layout
- `script.js` - city configuration, weather fetch logic, and UI updates

## Run Locally

Run the site from a local server so it opens through `localhost`.

### Option 1: Python 3

```bash
git clone https://github.com/yaseen4466/website.git
cd website
git checkout feature/bahrain-weather-site
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
git checkout feature/bahrain-weather-site
npx serve .
```

Open the localhost URL shown in the terminal.

## Expected Behavior

- The page first shows `Loading current weather...`
- After the API responds, the page shows the selected capital's weather details
- If the request fails or times out, the page shows an error message and a `Try Again` button

## Weather Data

The app uses the Open-Meteo API for current weather data and does not require an API key.
