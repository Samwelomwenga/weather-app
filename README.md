# Frontend Mentor - Weather app solution

This repository contains a completed solution for the
[Frontend Mentor Weather app challenge](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49).
The app uses the free
[Open-Meteo Forecast API](https://open-meteo.com/en/docs) and
[Open-Meteo Geocoding API](https://open-meteo.com/en/docs/geocoding-api) to
show current, daily, and hourly weather for a selected location.

## Overview

Users can:

- Resolve weather for their browser location when geolocation is allowed.
- Fall back to Berlin, Germany when geolocation is denied or unavailable.
- Search for a place and use the best matching Open-Meteo geocoding result.
- View the current temperature, condition icon, location, date, feels-like
  temperature, humidity, wind speed, and precipitation.
- Browse a 7-day daily forecast with high and low temperatures.
- Switch the hourly forecast between forecast days.
- Change measurement units between metric and imperial presets or individual
  temperature, wind speed, and precipitation units.
- Reload failed forecast requests from the error state.
- Use the app across desktop, mobile, and narrow mobile layouts with visible
  hover and focus states.

## Links

- Challenge URL:
  [Frontend Mentor Weather app](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49)
- Repository URL: https://github.com/Samwelomwenga/weather-app
- Live Site URL: https://weather-app-chi-plum-29.vercel.app/
- Solution URL: Not submitted on Frontend Mentor yet.

## Built With

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- TanStack Query
- Radix UI dropdown primitives
- `nuqs` for URL-backed application state
- Open-Meteo forecast and geocoding APIs

## API Usage

The app calls Open-Meteo directly from the browser and does not require an API
key.

- Forecast data is requested from `https://api.open-meteo.com/v1/forecast`.
- Location search is requested from
  `https://geocoding-api.open-meteo.com/v1/search`.
- Forecast requests include current weather, hourly temperature and weather
  codes, and 7 daily forecast rows.
- Unit selections are sent through Open-Meteo query parameters:
  `temperature_unit`, `wind_speed_unit`, and `precipitation_unit`.

## Running Locally

Install dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Run verification checks:

```bash
pnpm lint
pnpm build
```

Preview the production build:

```bash
pnpm preview
```
