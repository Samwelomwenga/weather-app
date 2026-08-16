import type {
  PrecipitationUnit,
  TemperatureUnit,
  UnitPreferences,
  WindSpeedUnit,
} from "@/lib/units"
import iconDropdown from "@/assets/images/icon-dropdown.svg"
import iconUnits from "@/assets/images/icon-units.svg"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UnitGroup } from "@/components/units-converter/unit-group"
import {
  precipitationOptions,
  temperatureOptions,
  windSpeedOptions,
} from "@/components/units-converter/unit-options"
import {
  areUnitPreferencesEqual,
  metricUnitPreferences,
} from "@/lib/units"

type UnitsConverterProps = {
  setImperialUnits: () => void
  setMetricUnits: () => void
  setPrecipitationUnit: (value: PrecipitationUnit) => void
  setTemperatureUnit: (value: TemperatureUnit) => void
  setWindSpeedUnit: (value: WindSpeedUnit) => void
  unitPreferences: UnitPreferences
}

export function UnitsConverter({
  setImperialUnits,
  setMetricUnits,
  setPrecipitationUnit,
  setTemperatureUnit,
  setWindSpeedUnit,
  unitPreferences,
}: UnitsConverterProps) {
  const isMetricPreset = areUnitPreferencesEqual(
    unitPreferences,
    metricUnitPreferences,
  )
  const presetLabel = isMetricPreset
    ? "Switch to Imperial"
    : "Switch to Metric"
  const applyPreset = isMetricPreset ? setImperialUnits : setMetricUnits

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          className="h-8 rounded-lg px-3 text-sm focus-visible:ring-2 focus-visible:ring-neutral-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:bg-neutral-600 sm:h-11 sm:px-4 sm:text-base"
          aria-label="Change measurement units"
        >
          <img src={iconUnits} alt="" className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Units</span>
          <img src={iconDropdown} alt="" className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[13.5rem] rounded-lg border-border bg-popover p-2 shadow-xl"
      >
        <DropdownMenuItem
          className="min-h-10 cursor-pointer rounded-lg px-3 text-base font-semibold focus:bg-secondary focus:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground"
          onSelect={(event) => {
            // Keep the menu open so several units can be changed in one visit.
            event.preventDefault()
            applyPreset()
          }}
        >
          {presetLabel}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <UnitGroup
          label="Temperature"
          options={temperatureOptions}
          value={unitPreferences.temperatureUnit}
          onValueChange={setTemperatureUnit}
        />
        <DropdownMenuSeparator className="my-2" />
        <UnitGroup
          label="Wind Speed"
          options={windSpeedOptions}
          value={unitPreferences.windSpeedUnit}
          onValueChange={setWindSpeedUnit}
        />
        <DropdownMenuSeparator className="my-2" />
        <UnitGroup
          label="Precipitation"
          options={precipitationOptions}
          value={unitPreferences.precipitationUnit}
          onValueChange={setPrecipitationUnit}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
