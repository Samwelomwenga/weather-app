import type { WeatherMetric } from "@/types/forecast"
import { MetricCard } from "@/components/weather-dashboard/metric-card"

type CurrentConditionsProps = {
  isLoading?: boolean
  metrics: WeatherMetric[]
}

export function CurrentConditions({
  isLoading = false,
  metrics,
}: CurrentConditionsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
      {metrics.map(metric => (
        <MetricCard key={metric.label} isLoading={isLoading} metric={metric} />
      ))}
    </div>
  )
}
