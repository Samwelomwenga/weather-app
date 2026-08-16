import type { HourlyForecastHour } from "@/types/forecast"
import {
  formatForecastHour,
  formatTemperature,
  getWeatherSummary,
} from "@/lib/weather"

type HourlyForecastRowProps = {
  hour: HourlyForecastHour
  unit: string
}

export function HourlyForecastRow({ hour, unit }: HourlyForecastRowProps) {
  const weather = getWeatherSummary(hour.weatherCode)

  return (
    <div
      className="grid min-h-[3.25rem] grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3 transition-colors hover:border-neutral-300/50 hover:bg-neutral-600 sm:min-h-[3.875rem]"
      role="listitem"
    >
      <img
        src={weather.icon}
        alt={weather.description}
        className="h-8 w-8 object-contain"
      />
      <span className="text-sm font-medium">
        {formatForecastHour(hour.time)}
      </span>
      <span className="text-sm font-semibold">
        {formatTemperature(hour.temperature, unit)}
      </span>
    </div>
  )
}
