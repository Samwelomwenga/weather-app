import type { SuccessfulApiResponse } from "@/types/api-response"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { HourlyForecastDayPicker } from "@/components/weather-dashboard/hourly-forecast/hourly-forecast-day-picker"
import { HourlyForecastRow } from "@/components/weather-dashboard/hourly-forecast/hourly-forecast-row"
import { HourlyForecastRowSkeleton } from "@/components/weather-dashboard/hourly-forecast/hourly-forecast-row-skeleton"
import { useHourlyForecast } from "@/hooks/use-hourly-forecast"
import { DEFAULT_TEMPERATURE_UNIT } from "@/lib/weather"

const SKELETON_ROW_COUNT = 8

const skeletonKeys = Array.from(
  { length: SKELETON_ROW_COUNT },
  (_, index) => index,
)

type HourlyForecastProps = {
  forecast?: SuccessfulApiResponse
  isLoading?: boolean
}

export function HourlyForecast({ forecast, isLoading }: HourlyForecastProps) {
  const {
    dayOptions,
    hours,
    selectDay,
    selectedDateKey,
    selectedDayLabel,
  } = useHourlyForecast(forecast)
  const unit = forecast?.hourly_units.temperature_2m
    ?? DEFAULT_TEMPERATURE_UNIT
  const listLabel = dayOptions.length
    ? `${selectedDayLabel} hourly forecast`
    : "Hourly forecast"

  return (
    <Card
      className="rounded-lg border-0 bg-card py-4 sm:py-6"
      aria-labelledby="hourly-forecast-heading"
    >
      <CardHeader className="flex items-center justify-between gap-4 px-4 sm:px-6">
        <CardTitle id="hourly-forecast-heading" className="text-lg sm:text-xl">
          Hourly Forecast
        </CardTitle>
        <HourlyForecastDayPicker
          dayOptions={dayOptions}
          selectedDateKey={selectedDateKey}
          selectedDayLabel={selectedDayLabel}
          onSelectDay={selectDay}
        />
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div
          className="flex max-h-[37rem] flex-col gap-3 overflow-y-auto pr-1"
          role="list"
          aria-label={listLabel}
        >
          {isLoading && (
            <>
              <p className="sr-only" role="status" aria-live="polite">
                Loading hourly forecast...
              </p>
              {skeletonKeys.map(key => (
                <HourlyForecastRowSkeleton key={key} />
              ))}
            </>
          )}

          {!isLoading && hours.map(hour => (
            <HourlyForecastRow key={hour.time} hour={hour} unit={unit} />
          ))}

          {!isLoading && !hours.length && (
            <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
              Hourly forecast unavailable.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
