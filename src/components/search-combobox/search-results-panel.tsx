import type { PanelStatus } from "@/components/search-combobox/panel-status"
import type { LocationSuggestion } from "@/types/geocoding"
import { SearchSuggestionItem } from "@/components/search-combobox/search-suggestion-item"
import { SearchSuggestionsSkeleton } from "@/components/search-combobox/search-suggestions-skeleton"
import { CommandList } from "@/components/ui/command"

type SearchResultsPanelProps = {
  isRefreshing: boolean
  onSelectSuggestion: (suggestion: LocationSuggestion) => void
  searchTerm: string
  status: PanelStatus
  suggestions: LocationSuggestion[]
}

/**
 * Floating panel below the search input. Renders exactly one of the four
 * statuses; cmdk owns listbox semantics and keyboard navigation.
 */
export function SearchResultsPanel({
  isRefreshing,
  onSelectSuggestion,
  searchTerm,
  status,
  suggestions,
}: SearchResultsPanelProps) {
  return (
    <div
      className="absolute top-[calc(100%+0.5rem)] z-20 w-full overflow-hidden rounded-xl border border-white/10 bg-card shadow-2xl"
      // Keep the input focused when clicking a row so cmdk's select fires.
      onMouseDown={event => event.preventDefault()}
    >
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          {status === "results"
            ? `Results (${suggestions.length})`
            : "Suggestions"}
        </span>
        {isRefreshing && (
          <span className="text-xs text-muted-foreground">Updating…</span>
        )}
      </div>

      <CommandList className="max-h-80">
        {status === "loading" && <SearchSuggestionsSkeleton />}

        {status === "error" && (
          <p className="px-4 py-5 text-sm text-destructive" role="alert">
            Couldn’t load suggestions. Check your connection and try again.
          </p>
        )}

        {status === "empty" && (
          <p className="px-4 py-5 text-sm text-muted-foreground">
            No matches for “
            {searchTerm}
            ”.
          </p>
        )}

        {status === "results" && suggestions.map(suggestion => (
          <SearchSuggestionItem
            key={suggestion.id}
            suggestion={suggestion}
            onSelect={onSelectSuggestion}
          />
        ))}
      </CommandList>
    </div>
  )
}
