import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import SearchIcon from "@/assets/images/icon-search.svg"
import { Button } from "@/components/ui/button"
export function SearchInput() {
  return (
    <div className="flex mx-auto place-items-center gap-3">
    <InputGroup>
      <InputGroupAddon>
        <img src={SearchIcon} alt="Search Icon" />
      </InputGroupAddon>
      <InputGroupInput type="text" placeholder="Search for a city, e.g., New York" />
      
    </InputGroup>
    <Button className="mt-2">
      Search
    </Button>
  </div>
  );
}