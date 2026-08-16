import type {
  CurrentConditions,
  CurrentConditionUnits,
  WeatherMetric,
} from "@/types/forecast"
import { formatMeasurement, formatTemperature } from "@/lib/weather"

const metricLabels = [
  "Feels Like",
  "Humidity",
  "Wind",
  "Precipitation",
] as const

/**
 * Builds the current-conditions grid readings. Labels are always returned so
 * the grid keeps its shape (and its loading fallbacks) before data arrives.
 */
export function getCurrentConditionMetrics(
  current: CurrentConditions | undefined,
  units: CurrentConditionUnits | undefined,
): WeatherMetric[] {
  if (!current || !units) {
    return metricLabels.map(label => ({ label }))
  }

  return [
    {
      label: "Feels Like",
      value: formatTemperature(
        current.apparent_temperature,
        units.temperature_2m,
      ),
    },
    {
      label: "Humidity",
      value: formatMeasurement(
        current.relative_humidity_2m,
        units.relative_humidity_2m,
      ),
    },
    {
      label: "Wind",
      value: formatMeasurement(current.wind_speed_10m, units.wind_speed_10m),
    },
    {
      label: "Precipitation",
      value: formatMeasurement(current.precipitation, units.precipitation),
    },
  ]
}
