import { Skeleton } from "@/components/ui/skeleton"

export function DailyForecastCardSkeleton() {
  return (
    <article className="grid min-h-[8.75rem] grid-rows-[auto_1fr_auto] justify-items-center rounded-lg border border-border bg-card px-2 py-4 sm:min-h-40 sm:px-4 sm:py-5">
      <Skeleton className="h-5 w-12" />
      <Skeleton className="my-4 h-10 w-10 rounded-full sm:my-5 sm:h-12 sm:w-12" />
      <div className="flex w-full items-center justify-between gap-2 sm:gap-3">
        <Skeleton className="h-5 w-10" />
        <Skeleton className="h-5 w-10" />
      </div>
    </article>
  )
}
