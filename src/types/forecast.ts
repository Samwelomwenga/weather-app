import type { SuccessfulApiResponse } from "@/types/api-response"

export type CurrentConditions = SuccessfulApiResponse["current"]
export type CurrentConditionUnits = SuccessfulApiResponse["current_units"]

export type DailyForecastDay = {
  date: string
  highTemperature: number
  lowTemperature: number
  weatherCode: number
}

export type HourlyForecastHour = {
  dateKey: string
  temperature: number
  time: string
  weatherCode: number
}

export type HourlyDayOption = {
  dateKey: string
  label: string
}

/**
 * A single labelled reading in the current-conditions grid. `value` is absent
 * while the forecast is unavailable, which drives the loading fallback.
 */
export type WeatherMetric = {
  label: string
  value?: string
}

export type CurrentWeatherSummary = {
  date?: string
  icon?: string
  locationName?: string
  temperature?: string
  weatherDescription?: string
}
