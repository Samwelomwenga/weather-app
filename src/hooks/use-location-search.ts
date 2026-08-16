import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/constants/query-keys"
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_CHARS } from "@/constants/search"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { searchLocations } from "@/lib/geocoding"

/**
 * Debounced typeahead query. Returns the TanStack Query result as-is — the caller
 * reads `data`, `isPending`, `isFetching`, and `isError` to drive the combobox
 * states, so there's no bespoke status enum to keep in sync.
 */
export function useLocationSuggestions(search: string) {
  const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS)

  return useQuery({
    queryKey: [...queryKeys.locationSuggestions, debouncedSearch],
    queryFn: () => searchLocations(debouncedSearch),
    enabled: debouncedSearch.length >= SEARCH_MIN_CHARS,
    placeholderData: keepPreviousData,
  })
}
