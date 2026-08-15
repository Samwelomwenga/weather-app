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
- Live Site URL: Not configured in this repository yet.
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

## Notable Decisions

- Location, unit preferences, and selected hourly day are stored in the URL so
  the chosen state can survive reloads and be shared.
- TanStack Query keeps the last successful forecast visible while new searches
  or unit changes are fetching.
- The app preserves a stale forecast with a retry notice when a later forecast
  request fails, and shows a full-page error only when no forecast is available.
- Browser geolocation is attempted only when the URL does not already contain a
  valid selected location.
- Berlin is the explicit fallback location for denied or unavailable
  geolocation.

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

## Verification

Last checked on July 31, 2026.

- Lint: passed with `pnpm lint`.
- Production build: passed with `pnpm build`.
- Production preview smoke check: passed against `http://127.0.0.1:4173/`.
- Browser verification: passed with Chrome against local API fixtures for
  deterministic loading, no-results, and API-error states.

Manual verification covered:

- Default geolocation success.
- Geolocation denied or unavailable fallback to Berlin.
- Search success.
- Search no-results behavior.
- API error and retry behavior after automatic query retries are exhausted.
- Unit dropdown behavior and unit persistence in the URL.
- Hourly day selector behavior and selected-day persistence in the URL.
- Desktop layout around 1440px.
- Mobile layout around 375px.
- Narrow mobile layout around 320px.
- Loading, search-in-progress, no-results, API-error, dropdown, hover, and
  focus states.

## Known Limitations

- The repository does not currently include a configured production deployment
  URL or submitted Frontend Mentor solution URL.
- Weather data depends on Open-Meteo availability and the browser's network
  access.
- Browser geolocation depends on user permission and browser support.

## Author

- Samwel Omwenga
- Frontend Mentor profile: not provided in this repository.
