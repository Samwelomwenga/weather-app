import type { UnitOption } from "@/components/units-converter/unit-options"
import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

type UnitGroupProps<TValue extends string> = {
  label: string
  onValueChange: (value: TValue) => void
  options: UnitOption<TValue>[]
  value: TValue
}

/**
 * Single-select group of units. Checkbox items are used instead of radio items
 * to match the design's check affordance; selection stays mutually exclusive
 * because `checked` is derived from the active value.
 */
export function UnitGroup<TValue extends string>({
  label,
  onValueChange,
  options,
  value,
}: UnitGroupProps<TValue>) {
  return (
    <DropdownMenuGroup>
      <DropdownMenuLabel className="px-3 text-sm text-muted-foreground">
        {label}
      </DropdownMenuLabel>
      {options.map(option => (
        <DropdownMenuCheckboxItem
          key={option.value}
          textValue={option.label}
          checked={option.value === value}
          className="min-h-10 cursor-pointer rounded-lg text-base focus:bg-secondary focus:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground data-[state=checked]:bg-secondary"
          onCheckedChange={() => onValueChange(option.value)}
          onSelect={event => event.preventDefault()}
        >
          {option.label}
        </DropdownMenuCheckboxItem>
      ))}
    </DropdownMenuGroup>
  )
}
