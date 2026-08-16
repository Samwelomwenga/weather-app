import type { CSSProperties } from "react"
import type { CurrentWeatherSummary } from "@/types/forecast"
import todayCardBackground from "@/assets/images/bg-today-large.svg"
import todayCardBackgroundSmall from "@/assets/images/bg-today-small.svg"
import { Skeleton } from "@/components/ui/skeleton"

const todayCardStyle = {
  "--today-card-bg-large": `url(${todayCardBackground})`,
  "--today-card-bg-small": `url(${todayCardBackgroundSmall})`,
} as CSSProperties

type CurrentWeatherCardProps = CurrentWeatherSummary & {
  isLoading?: boolean
}

/**
 * Hero card for the active location. Each field falls back to its own skeleton
 * so partially resolved data still renders.
 */
export function CurrentWeatherCard({
  date,
  icon,
  isLoading = false,
  locationName,
  temperature,
  weatherDescription,
}: CurrentWeatherCardProps) {
  return (
    <article
      className="flex min-h-[15.25rem] flex-col justify-between overflow-hidden rounded-lg bg-blue-500 bg-[image:var(--today-card-bg-small)] bg-cover bg-center p-6 text-center sm:min-h-[17.75rem] sm:bg-[image:var(--today-card-bg-large)] sm:p-8 sm:text-left lg:min-h-[18rem]"
      style={todayCardStyle}
      role={isLoading ? "status" : undefined}
      aria-live={isLoading ? "polite" : undefined}
      aria-busy={isLoading || undefined}
    >
      <div>
        {locationName
          ? (
              <h2 className="break-words text-2xl font-bold sm:text-3xl">
                {locationName}
              </h2>
            )
          : (
              <Skeleton className="mx-auto h-9 w-56 max-w-full bg-neutral-0/20 sm:mx-0 sm:w-64" />
            )}

        {date
          ? (
              <p className="mt-2 text-base font-medium text-neutral-0/85">
                {date}
              </p>
            )
          : (
              <Skeleton className="mx-auto mt-3 h-5 w-48 max-w-full bg-neutral-0/20 sm:mx-0" />
            )}
      </div>

      <div className="flex items-end justify-between gap-6">
        {icon && weatherDescription
          ? (
              <img
                src={icon}
                alt={weatherDescription}
                className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              />
            )
          : (
              <Skeleton className="h-20 w-20 rounded-full bg-neutral-0/20 sm:h-24 sm:w-24" />
            )}

        {temperature
          ? (
              <p className="text-7xl leading-none font-bold sm:text-8xl">
                {temperature}
              </p>
            )
          : (
              <Skeleton className="h-20 w-36 bg-neutral-0/20" />
            )}
      </div>
    </article>
  )
}
