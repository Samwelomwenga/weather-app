import type { FormEvent } from "react"
import { useId, useState } from "react"
import LoadingIcon from "@/assets/images/icon-loading.svg"
import SearchIcon from "@/assets/images/icon-search.svg"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

type SearchInputProps = {
  errorMessage?: string
  isSearching?: boolean
  onSearch: (query: string) => void
}

export function SearchInput({
  errorMessage,
  isSearching = false,
  onSearch,
}: SearchInputProps) {
  const [query, setQuery] = useState("")
  const inputId = useId()
  const feedbackId = useId()
  const trimmedQuery = query.trim()
  const hasFeedback = isSearching || Boolean(errorMessage)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!trimmedQuery || isSearching) {
      return
    }

    onSearch(trimmedQuery)
  }

  return (
    <form
      className="w-full"
      onSubmit={handleSubmit}
    >
      <div className="flex flex-col place-items-center gap-3 sm:flex-row sm:items-start">
        <div className="w-full">
          <label className="sr-only" htmlFor={inputId}>
            Search for a place
          </label>
          <InputGroup className="h-14 rounded-lg border-0 bg-card transition-colors hover:bg-secondary/80 focus-within:ring-2 focus-within:ring-neutral-0 focus-within:ring-offset-2 focus-within:ring-offset-background">
            <InputGroupAddon>
              <img src={SearchIcon} alt="" className="h-5 w-5" />
            </InputGroupAddon>
            <InputGroupInput
              id={inputId}
              type="text"
              value={query}
              placeholder="Search for a place..."
              className="text-base"
              autoComplete="off"
              aria-describedby={hasFeedback ? feedbackId : undefined}
              aria-invalid={errorMessage ? true : undefined}
              disabled={isSearching}
              required
              onChange={event => setQuery(event.target.value)}
            />
          </InputGroup>

          {isSearching && (
            <p
              id={feedbackId}
              className="mt-3 flex h-14 items-center gap-3 rounded-lg bg-card px-4 text-left text-sm font-medium"
              role="status"
              aria-live="polite"
            >
              <img src={LoadingIcon} alt="" className="h-5 w-5 animate-spin" />
              Search in progress
            </p>
          )}

          {!isSearching && errorMessage && (
            <p
              id={feedbackId}
              className="mt-3 rounded-lg border border-destructive/40 bg-card px-4 py-3 text-left text-sm font-medium text-destructive"
              role="alert"
            >
              {errorMessage}
            </p>
          )}
        </div>

        <Button
          className="h-14 w-full rounded-lg px-8 text-base focus-visible:ring-2 focus-visible:ring-neutral-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:w-auto"
          type="submit"
          disabled={isSearching}
        >
          Search
        </Button>
      </div>
    </form>
  )
}
