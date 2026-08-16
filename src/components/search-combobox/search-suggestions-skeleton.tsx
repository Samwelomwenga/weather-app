import { Skeleton } from "@/components/ui/skeleton"

const skeletonKeys = [0, 1, 2]

export function SearchSuggestionsSkeleton() {
  return (
    <div className="space-y-3 px-4 py-4" role="status" aria-live="polite">
      <span className="sr-only">Searching for places…</span>
      {skeletonKeys.map(key => (
        <div key={key} className="flex items-center gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3.5 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  )
}
