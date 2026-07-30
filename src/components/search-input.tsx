import SearchIcon from "@/assets/images/icon-search.svg"
import { Button } from "@/components/ui/button"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export function SearchInput() {
  return (
    <form
      className="flex w-full flex-col place-items-center gap-3 sm:flex-row"
      onSubmit={event => event.preventDefault()}
    >
      <InputGroup className="h-14 rounded-lg border-0 bg-card">
        <InputGroupAddon>
          <img src={SearchIcon} alt="" className="h-5 w-5" />
        </InputGroupAddon>
        <InputGroupInput
          type="text"
          placeholder="Search for a place..."
          className="text-base"
        />
      </InputGroup>
      <Button
        className="h-14 w-full rounded-lg px-8 text-base sm:w-auto"
        type="submit"
      >
        Search
      </Button>
    </form>
  )
}
