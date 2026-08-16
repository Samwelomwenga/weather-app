import type { LocationSuggestion } from "@/types/geocoding"
import { MapPin } from "lucide-react"
import { CommandItem } from "@/components/ui/command"

type SearchSuggestionItemProps = {
  onSelect: (suggestion: LocationSuggestion) => void
  suggestion: LocationSuggestion
}

export function SearchSuggestionItem({
  onSelect,
  suggestion,
}: SearchSuggestionItemProps) {
  const region = [suggestion.admin1, suggestion.country]
    .filter(Boolean)
    .join(" · ")

  return (
    <CommandItem
      value={suggestion.id}
      className="flex items-center gap-3 rounded-none px-4 py-3 data-[selected=true]:bg-secondary data-[selected=true]:text-foreground"
      onSelect={() => onSelect(suggestion)}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary/60">
        <MapPin className="h-4 w-4 text-foreground/70" />
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="truncate text-sm font-semibold text-foreground">
          {suggestion.city}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {region}
        </span>
      </span>
    </CommandItem>
  )
}
