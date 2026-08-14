import type { SelectedLocation } from "@/hooks/use-selected-location"
import type { LocationSuggestion } from "@/types/geocoding"
import { Command as CommandPrimitive } from "cmdk"
import { MapPin } from "lucide-react"
import { useId, useState } from "react"
import SearchIcon from "@/assets/images/icon-search.svg"
import {
  Command,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Skeleton } from "@/components/ui/skeleton"
import { SEARCH_MIN_CHARS } from "@/constants/search"
import { useLocationSuggestions } from "@/hooks/use-location-search"
import { suggestionToLocation } from "@/lib/geocoding"

type SearchComboboxProps = {
  onSelect: (location: SelectedLocation) => void
}

/**
 * Live typeahead place search built on cmdk (Command). cmdk owns the ARIA
 * combobox/listbox semantics, keyboard navigation, active-item highlight and
 * scrolling; this component only owns the input text and open state, and maps the
 * TanStack Query result to loading / empty / error / results rows.
 */
export function SearchCombobox({ onSelect }: SearchComboboxProps) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const inputId = useId()

  const query = useLocationSuggestions(search)
  const results = query.data ?? []
  const trimmed = search.trim()

  const status = getPanelStatus({
    isError: query.isError,
    isPending: query.isPending,
    resultCount: results.length,
  })
  const isRefreshing = query.isFetching && !query.isPending
  const showPanel = isOpen && trimmed.length >= SEARCH_MIN_CHARS

  function choose(suggestion: LocationSuggestion) {
    onSelect(suggestionToLocation(suggestion))
    setSearch(suggestion.label)
    setIsOpen(false)
  }

  return (
    <Command
      shouldFilter={false}
      className="relative w-full overflow-visible bg-transparent"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setIsOpen(false)
        }
      }}
    >
      <label className="sr-only" htmlFor={inputId}>
        Search for a place
      </label>
      <div className="flex h-14 items-center gap-3 rounded-lg bg-card px-4 transition-colors hover:bg-secondary/80 focus-within:ring-2 focus-within:ring-neutral-0 focus-within:ring-offset-2 focus-within:ring-offset-background">
        <img src={SearchIcon} alt="" className="h-5 w-5 shrink-0" />
        <CommandPrimitive.Input
          id={inputId}
          value={search}
          placeholder="Search for a place..."
          className="h-full flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
          onValueChange={(value) => {
            setSearch(value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
        />
      </div>

      {showPanel && (
        <div
          className="absolute top-[calc(100%+0.5rem)] z-20 w-full overflow-hidden rounded-xl border border-white/10 bg-card shadow-2xl"
          // Keep the input focused when clicking a row so cmdk's select fires.
          onMouseDown={event => event.preventDefault()}
        >
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {status === "results" ? `Results (${results.length})` : "Suggestions"}
            </span>
            {isRefreshing && (
              <span className="text-xs text-muted-foreground">Updating…</span>
            )}
          </div>

          <CommandList className="max-h-80">
            {status === "loading" && <LoadingRows />}

            {status === "error" && (
              <p className="px-4 py-5 text-sm text-destructive" role="alert">
                Couldn’t load suggestions. Check your connection and try again.
              </p>
            )}

            {status === "empty" && (
              <p className="px-4 py-5 text-sm text-muted-foreground">
                No matches for “
                {trimmed}
                ”.
              </p>
            )}

            {status === "results"
              && results.map(suggestion => (
                <CommandItem
                  key={suggestion.id}
                  value={suggestion.id}
                  onSelect={() => choose(suggestion)}
                  className="flex items-center gap-3 rounded-none px-4 py-3 data-[selected=true]:bg-secondary data-[selected=true]:text-foreground"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/60">
                    <MapPin className="h-4 w-4 text-foreground/70" />
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-sm font-semibold text-foreground">
                      {suggestion.city}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {[suggestion.admin1, suggestion.country]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </span>
                </CommandItem>
              ))}
          </CommandList>
        </div>
      )}
    </Command>
  )
}

type PanelStatus = "loading" | "error" | "empty" | "results"

function getPanelStatus({
  isError,
  isPending,
  resultCount,
}: {
  isError: boolean
  isPending: boolean
  resultCount: number
}): PanelStatus {
  if (isError) {
    return "error"
  }
  if (isPending) {
    return "loading"
  }
  return resultCount === 0 ? "empty" : "results"
}

function LoadingRows() {
  return (
    <div className="space-y-3 px-4 py-4" role="status" aria-live="polite">
      <span className="sr-only">Searching for places…</span>
      {[0, 1, 2].map(row => (
        <div key={row} className="flex items-center gap-3">
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
