import type { SelectedLocation } from "@/hooks/use-selected-location"
import type { LocationSuggestion } from "@/types/geocoding"
import { Command as CommandPrimitive } from "cmdk"
import { useId, useState } from "react"
import SearchIcon from "@/assets/images/icon-search.svg"
import { getPanelStatus } from "@/components/search-combobox/panel-status"
import { SearchResultsPanel } from "@/components/search-combobox/search-results-panel"
import { Command } from "@/components/ui/command"
import { SEARCH_MIN_CHARS } from "@/constants/search"
import { useLocationSuggestions } from "@/hooks/use-location-search"
import { suggestionToLocation } from "@/lib/geocoding"

type SearchComboboxProps = {
  onSelect: (location: SelectedLocation) => void
}

/**
 * Live typeahead place search built on cmdk (Command). cmdk owns the ARIA
 * combobox/listbox semantics, keyboard navigation, active-item highlight and
 * scrolling; this component only owns the input text and open state, and maps
 * the TanStack Query result to the panel's loading / empty / error / results
 * states.
 */
export function SearchCombobox({ onSelect }: SearchComboboxProps) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const inputId = useId()
  const query = useLocationSuggestions(search)
  const suggestions = query.data ?? []
  const searchTerm = search.trim()
  const status = getPanelStatus({
    isError: query.isError,
    isPending: query.isPending,
    resultCount: suggestions.length,
  })
  const isPanelVisible = isOpen && searchTerm.length >= SEARCH_MIN_CHARS

  function handleSelectSuggestion(suggestion: LocationSuggestion) {
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

      {isPanelVisible && (
        <SearchResultsPanel
          isRefreshing={query.isFetching && !query.isPending}
          searchTerm={searchTerm}
          status={status}
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
        />
      )}
    </Command>
  )
}
