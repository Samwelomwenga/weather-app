import type { SuccessfulApiResponse } from "@/types/api-response"
import { Skeleton } from "@/components/ui/skeleton"
import {
  formatForecastShortDay,
  formatTemperature,
  getWeatherSummary,
} from "@/lib/weather"

type DailyForecastProps = {
  forecast?: SuccessfulApiResponse
  isLoading?: boolean
}

type DailyForecastDay = {
  date: string
  highTemperature: number
  lowTemperature: number
  weatherCode: number
}

const loadingCardKeys = Array.from({ length: 7 }, (_, index) => index)

export function DailyForecast({ forecast, isLoading }: DailyForecastProps) {
  const dailyCards = getDailyForecastCards(forecast)
  const unit = forecast?.daily_units.temperature_2m_max ?? "°C"

  return (
    <section aria-labelledby="daily-forecast-heading">
      <h2 id="daily-forecast-heading" className="text-xl font-bold">
        Daily Forecast
      </h2>

      <div className="mt-5 grid grid-cols-2 gap-4 min-[520px]:grid-cols-4 xl:grid-cols-7">
        {isLoading && loadingCardKeys.map(key => (
          <DailyForecastCardSkeleton key={key} />
        ))}

        {!isLoading && dailyCards.map(day => (
          <DailyForecastCard
            key={day.date}
            day={day}
            unit={unit}
          />
        ))}
      </div>

      {!isLoading && !dailyCards.length && (
        <p className="mt-4 rounded-lg bg-card px-4 py-3 text-sm text-muted-foreground">
          Daily forecast unavailable.
        </p>
      )}
    </section>
  )
}

type DailyForecastCardProps = {
  day: DailyForecastDay
  unit: string
}

function DailyForecastCard({ day, unit }: DailyForecastCardProps) {
  const weather = getWeatherSummary(day.weatherCode)

  return (
    <article className="grid min-h-40 grid-rows-[auto_1fr_auto] justify-items-center rounded-lg border border-border bg-card px-4 py-5 text-center">
      <h3 className="text-base font-semibold">
        {formatForecastShortDay(day.date)}
      </h3>
      <img
        src={weather.icon}
        alt={weather.description}
        className="my-5 h-12 w-12 object-contain"
      />
      <div className="flex w-full items-center justify-between gap-3 text-sm font-semibold">
        <span>{formatTemperature(day.highTemperature, unit)}</span>
        <span className="text-muted-foreground">
          {formatTemperature(day.lowTemperature, unit)}
        </span>
      </div>
    </article>
  )
}

function DailyForecastCardSkeleton() {
  return (
    <article className="grid min-h-40 grid-rows-[auto_1fr_auto] justify-items-center rounded-lg border border-border bg-card px-4 py-5">
      <Skeleton className="h-5 w-12" />
      <Skeleton className="my-5 h-12 w-12 rounded-full" />
      <div className="flex w-full items-center justify-between gap-3">
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-5 w-10" />
      </div>
    </article>
  )
}

function getDailyForecastCards(
  forecast: SuccessfulApiResponse | undefined,
): DailyForecastDay[] {
  if (!forecast) {
    return []
  }

  return forecast.daily.time.reduce<DailyForecastDay[]>(
    (cards, time, index) => {
      const weatherCode = forecast.daily.weather_code[index]
      const highTemperature = forecast.daily.temperature_2m_max[index]
      const lowTemperature = forecast.daily.temperature_2m_min[index]

      if (
        weatherCode === undefined
        || highTemperature === undefined
        || lowTemperature === undefined
      ) {
        return cards
      }

      cards.push({
        date: time,
        highTemperature,
        lowTemperature,
        weatherCode,
      })

      return cards
    },
    [],
  ).slice(0, 7)
}
