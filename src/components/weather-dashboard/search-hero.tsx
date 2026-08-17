import type { SelectedLocation } from "@/hooks/use-selected-location"
import { SearchCombobox } from "@/components/search-combobox/search-combobox"

type SearchHeroProps = {
  onSelectLocation: (location: SelectedLocation) => void
}

export function SearchHero({ onSelectLocation }: SearchHeroProps) {
  return (
    <section className="mx-auto flex w-full max-w-164 flex-col items-center gap-8 pt-5 text-center lg:gap-12">
      <h1 className="max-w-[12ch] font-display text-[2.5rem] leading-[1.15] font-bold text-balance sm:max-w-none sm:text-5xl lg:text-6xl">
        How&apos;s the sky looking today?
      </h1>
      <SearchCombobox onSelect={onSelectLocation} />
    </section>
  )
}
