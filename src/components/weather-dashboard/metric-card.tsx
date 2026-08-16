import type { WeatherMetric } from "@/types/forecast"
import { Skeleton } from "@/components/ui/skeleton"

type MetricCardProps = {
  isLoading?: boolean
  metric: WeatherMetric
}

export function MetricCard({ isLoading = false, metric }: MetricCardProps) {
  return (
    <article className="min-h-[6.25rem] rounded-lg border border-border bg-card p-4 transition-colors hover:border-neutral-300/50 hover:bg-neutral-700 sm:min-h-32 sm:p-5">
      <p className="font-medium text-muted-foreground">{metric.label}</p>
      {metric.value
        ? (
            <p className="mt-4 text-3xl font-semibold sm:mt-6">
              {metric.value}
            </p>
          )
        : (
            <MetricValueFallback isLoading={isLoading} label={metric.label} />
          )}
    </article>
  )
}

type MetricValueFallbackProps = {
  isLoading: boolean
  label: string
}

/**
 * While loading, a dash keeps the card height stable and gives screen readers
 * something labelled to announce; otherwise the value is simply unavailable.
 */
function MetricValueFallback({ isLoading, label }: MetricValueFallbackProps) {
  if (isLoading) {
    return (
      <p
        className="mt-4 text-3xl font-semibold sm:mt-6"
        aria-label={`${label} loading`}
      >
        -
      </p>
    )
  }

  return <Skeleton className="mt-5 h-9 w-24 sm:mt-7" />
}
