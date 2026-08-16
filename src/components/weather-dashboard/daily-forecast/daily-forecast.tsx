import type { SuccessfulApiResponse } from "@/types/api-response"
import { DailyForecastCard } from "@/components/weather-dashboard/daily-forecast/daily-forecast-card"
import { DailyForecastCardSkeleton } from "@/components/weather-dashboard/daily-forecast/daily-forecast-card-skeleton"
import { FORECAST_DAY_COUNT, getDailyForecastDays } from "@/lib/forecast"
import { DEFAULT_TEMPERATURE_UNIT } from "@/lib/weather"

const skeletonKeys = Array.from(
  { length: FORECAST_DAY_COUNT },
  (_, index) => index,
)

type DailyForecastProps = {
  forecast?: SuccessfulApiResponse
  isLoading?: boolean
}

export function DailyForecast({ forecast, isLoading }: DailyForecastProps) {
  const days = getDailyForecastDays(forecast)
  const unit = forecast?.daily_units.temperature_2m_max
    ?? DEFAULT_TEMPERATURE_UNIT

  return (
    <section aria-labelledby="daily-forecast-heading">
      <h2 id="daily-forecast-heading" className="text-xl font-bold">
        Daily Forecast
      </h2>

      <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-4 min-[680px]:grid-cols-4 xl:grid-cols-7">
        {isLoading
          ? skeletonKeys.map(key => <DailyForecastCardSkeleton key={key} />)
          : days.map(day => (
              <DailyForecastCard key={day.date} day={day} unit={unit} />
            ))}
      </div>

      {!isLoading && !days.length && (
        <p className="mt-4 rounded-lg bg-card px-4 py-3 text-sm text-muted-foreground">
          Daily forecast unavailable.
        </p>
      )}
    </section>
  )
}
