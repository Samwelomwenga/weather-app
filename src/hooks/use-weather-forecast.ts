import type { SelectedLocation } from "@/hooks/use-selected-location"
import type { UnitPreferences } from "@/lib/units"
import type {
  ApiResponse,
  SuccessfulApiResponse,
} from "@/types/api-response"
import { useQuery } from "@tanstack/react-query"
import { useMemo } from "react"
import { queryKeys } from "@/constants/query-keys"

export type FetchWeatherForecastQueryParams = {
  latitude: number
  longitude: number
  current: string
  hourly: string
  daily: string
  temperature_unit: "celsius" | "fahrenheit"
  wind_speed_unit: "kmh" | "ms" | "mph" | "kn"
  precipitation_unit: "mm" | "inch"
  timeformat?: string
  timezone: string
  forecast_days: number
  forecast_hours?: number
}

const OPEN_METEO_FORECAST_URL = "https://api.open-meteo.com/v1/forecast"

const currentWeatherFields = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "precipitation",
  "weather_code",
  "wind_speed_10m",
] as const

const hourlyForecastFields = [
  "temperature_2m",
  "weather_code",
] as const

const dailyForecastFields = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
] as const

export function useFetchWeatherForecast(
  location: SelectedLocation | null,
  unitPreferences: UnitPreferences,
) {
  const {
    precipitationUnit,
    temperatureUnit,
    windSpeedUnit,
  } = unitPreferences
  const params = useMemo(
    () => (
      location
        ? buildWeatherForecastParams(location, {
            precipitationUnit,
            temperatureUnit,
            windSpeedUnit,
          })
        : null
    ),
    [
      location,
      precipitationUnit,
      temperatureUnit,
      windSpeedUnit,
    ],
  )

  return useQuery<SuccessfulApiResponse, Error>({
    queryKey: [...queryKeys.forecast, params],
    queryFn: () => fetchWeatherForecast(params),
    enabled: params !== null,
  })
}

export function buildWeatherForecastParams(
  location: SelectedLocation,
  unitPreferences: UnitPreferences,
): FetchWeatherForecastQueryParams {
  return {
    latitude: location.latitude,
    longitude: location.longitude,
    current: currentWeatherFields.join(","),
    hourly: hourlyForecastFields.join(","),
    daily: dailyForecastFields.join(","),
    temperature_unit: unitPreferences.temperatureUnit,
    wind_speed_unit: unitPreferences.windSpeedUnit,
    precipitation_unit: unitPreferences.precipitationUnit,
    timezone: location.timezone,
    forecast_days: 7,
  }
}

async function fetchWeatherForecast(
  params: FetchWeatherForecastQueryParams | null,
) {
  if (params === null) {
    throw new Error("A selected location is required to fetch the forecast")
  }

  const searchParams = new URLSearchParams(
    Object.entries(params).map(([key, value]) => [key, String(value)]),
  )
  const response = await fetch(`${OPEN_METEO_FORECAST_URL}?${searchParams}`)
  const data = await response.json() as ApiResponse

  if (!response.ok || "error" in data) {
    throw new Error(getForecastErrorMessage(data))
  }

  return data
}

function getForecastErrorMessage(data: ApiResponse) {
  if ("reason" in data && data.reason) {
    return data.reason
  }

  return "Failed to fetch weather forecast"
}
