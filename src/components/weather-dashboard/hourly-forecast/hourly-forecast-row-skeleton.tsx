import { Skeleton } from "@/components/ui/skeleton"

export function HourlyForecastRowSkeleton() {
  return (
    <div className="grid min-h-[3.25rem] grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3 sm:min-h-[3.875rem]">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-10" />
    </div>
  )
}
