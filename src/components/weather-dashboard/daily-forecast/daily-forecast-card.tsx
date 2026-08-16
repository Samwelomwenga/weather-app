import type { DailyForecastDay } from "@/types/forecast"
import {
  formatForecastShortDay,
  formatTemperature,
  getWeatherSummary,
} from "@/lib/weather"

type DailyForecastCardProps = {
  day: DailyForecastDay
  unit: string
}

export function DailyForecastCard({ day, unit }: DailyForecastCardProps) {
  const weather = getWeatherSummary(day.weatherCode)

  return (
    <article className="grid min-h-[8.75rem] grid-rows-[auto_1fr_auto] justify-items-center rounded-lg border border-border bg-card px-2 py-4 text-center transition-colors hover:border-neutral-300/50 hover:bg-neutral-700 sm:min-h-40 sm:px-4 sm:py-5">
      <h3 className="text-base font-semibold">
        {formatForecastShortDay(day.date)}
      </h3>
      <img
        src={weather.icon}
        alt={weather.description}
        className="my-4 h-10 w-10 object-contain sm:my-5 sm:h-12 sm:w-12"
      />
      <div className="flex w-full items-center justify-between gap-2 text-sm font-semibold sm:gap-3">
        <span>{formatTemperature(day.highTemperature, unit)}</span>
        <span className="text-muted-foreground">
          {formatTemperature(day.lowTemperature, unit)}
        </span>
      </div>
    </article>
  )
}
