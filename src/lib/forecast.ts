import type { SuccessfulApiResponse } from "@/types/api-response"
import type {
  DailyForecastDay,
  HourlyDayOption,
  HourlyForecastHour,
} from "@/types/forecast"
import { formatForecastDayOption } from "@/lib/weather"

export const FORECAST_DAY_COUNT = 7

/**
 * Flattens Open-Meteo's parallel daily arrays into per-day records, skipping
 * any index where a reading is missing.
 */
export function getDailyForecastDays(
  forecast: SuccessfulApiResponse | undefined,
): DailyForecastDay[] {
  if (!forecast) {
    return []
  }

  return forecast.daily.time
    .reduce<DailyForecastDay[]>((days, time, index) => {
      const weatherCode = forecast.daily.weather_code[index]
      const highTemperature = forecast.daily.temperature_2m_max[index]
      const lowTemperature = forecast.daily.temperature_2m_min[index]

      if (
        weatherCode === undefined
        || highTemperature === undefined
        || lowTemperature === undefined
      ) {
        return days
      }

      days.push({
        date: time,
        highTemperature,
        lowTemperature,
        weatherCode,
      })

      return days
    }, [])
    .slice(0, FORECAST_DAY_COUNT)
}

/**
 * Flattens Open-Meteo's parallel hourly arrays, tagging each hour with the
 * `YYYY-MM-DD` key used to group hours under a selected day.
 */
export function getHourlyForecastHours(
  forecast: SuccessfulApiResponse | undefined,
): HourlyForecastHour[] {
  if (!forecast) {
    return []
  }

  return forecast.hourly.time.reduce<HourlyForecastHour[]>(
    (hours, time, index) => {
      const temperature = forecast.hourly.temperature_2m[index]
      const weatherCode = forecast.hourly.weather_code[index]

      if (temperature === undefined || weatherCode === undefined) {
        return hours
      }

      hours.push({
        dateKey: time.slice(0, 10),
        temperature,
        time,
        weatherCode,
      })

      return hours
    },
    [],
  )
}

export function getHourlyDayOptions(
  forecast: SuccessfulApiResponse | undefined,
): HourlyDayOption[] {
  if (!forecast) {
    return []
  }

  return forecast.daily.time
    .slice(0, FORECAST_DAY_COUNT)
    .map(dateKey => ({
      dateKey,
      label: formatForecastDayOption(dateKey),
    }))
}
