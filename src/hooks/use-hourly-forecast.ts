import type { SuccessfulApiResponse } from "@/types/api-response"
import type { HourlyDayOption, HourlyForecastHour } from "@/types/forecast"
import { parseAsString, useQueryState } from "nuqs"
import { getHourlyDayOptions, getHourlyForecastHours } from "@/lib/forecast"

const FALLBACK_DAY_LABEL = "Today"

export type HourlyForecastState = {
  dayOptions: HourlyDayOption[]
  hours: HourlyForecastHour[]
  selectDay: (dateKey: string) => void
  selectedDateKey?: string
  selectedDayLabel: string
}

/**
 * Owns hourly-forecast day selection. The chosen day lives in the `day` query
 * param so the view survives reloads and sharing; an unknown or missing param
 * falls back to the first available day.
 */
export function useHourlyForecast(
  forecast: SuccessfulApiResponse | undefined,
): HourlyForecastState {
  const [selectedDate, setSelectedDate] = useQueryState(
    "day",
    parseAsString.withOptions({
      clearOnDefault: false,
      history: "replace",
      shallow: true,
    }),
  )
  const dayOptions = getHourlyDayOptions(forecast)
  const selectedDateKey = dayOptions.find(
    day => day.dateKey === selectedDate,
  )?.dateKey ?? dayOptions[0]?.dateKey
  const selectedDayLabel = dayOptions.find(
    day => day.dateKey === selectedDateKey,
  )?.label ?? FALLBACK_DAY_LABEL
  const hours = getHourlyForecastHours(forecast)
    .filter(hour => hour.dateKey === selectedDateKey)

  return {
    dayOptions,
    hours,
    selectDay: (dateKey) => {
      void setSelectedDate(dateKey)
    },
    selectedDateKey,
    selectedDayLabel,
  }
}
