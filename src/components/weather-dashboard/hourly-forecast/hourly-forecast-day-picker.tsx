import type { HourlyDayOption } from "@/types/forecast"
import iconDropdown from "@/assets/images/icon-dropdown.svg"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type HourlyForecastDayPickerProps = {
  dayOptions: HourlyDayOption[]
  onSelectDay: (dateKey: string) => void
  selectedDateKey?: string
  selectedDayLabel: string
}

export function HourlyForecastDayPicker({
  dayOptions,
  onSelectDay,
  selectedDateKey,
  selectedDayLabel,
}: HourlyForecastDayPickerProps) {
  const hasDayOptions = dayOptions.length > 0

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="h-9 rounded-lg px-3 text-sm focus-visible:ring-2 focus-visible:ring-neutral-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:bg-neutral-600 sm:h-10 sm:text-base"
          disabled={!hasDayOptions}
          aria-label={hasDayOptions
            ? `Select hourly forecast day, ${selectedDayLabel} selected`
            : "Hourly forecast day unavailable"}
        >
          {hasDayOptions ? selectedDayLabel : "-"}
          <img src={iconDropdown} alt="" className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[13.5rem] rounded-lg border-border bg-popover p-2 shadow-xl"
      >
        <DropdownMenuRadioGroup
          value={selectedDateKey}
          onValueChange={onSelectDay}
        >
          {dayOptions.map(day => (
            <DropdownMenuRadioItem
              key={day.dateKey}
              textValue={day.label}
              value={day.dateKey}
              className="min-h-10 cursor-pointer rounded-lg text-base focus:bg-secondary focus:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground data-[state=checked]:bg-secondary"
            >
              {day.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
