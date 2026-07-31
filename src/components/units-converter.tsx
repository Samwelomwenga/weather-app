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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  areUnitPreferencesEqual,
  metricUnitPreferences,
} from "@/lib/units"

const temperatureOptions = [
  { label: "Celsius (°C)", value: "celsius" },
  { label: "Fahrenheit (°F)", value: "fahrenheit" },
] satisfies UnitOption<TemperatureUnit>[]

const windSpeedOptions = [
  { label: "km/h", value: "kmh" },
  { label: "mph", value: "mph" },
] satisfies UnitOption<WindSpeedUnit>[]

const precipitationOptions = [
  { label: "Millimeters (mm)", value: "mm" },
  { label: "Inches (in)", value: "inch" },
] satisfies UnitOption<PrecipitationUnit>[]

type UnitsConverterProps = {
  unitPreferences: UnitPreferences
  setTemperatureUnit: (value: TemperatureUnit) => void
  setWindSpeedUnit: (value: WindSpeedUnit) => void
  setPrecipitationUnit: (value: PrecipitationUnit) => void
  setMetricUnits: () => void
  setImperialUnits: () => void
}

type UnitOption<TValue extends string> = {
  label: string
  value: TValue
}

export function UnitsConverter({
  unitPreferences,
  setTemperatureUnit,
  setWindSpeedUnit,
  setPrecipitationUnit,
  setMetricUnits,
  setImperialUnits,
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
      <DropdownMenuContent align="end" className="w-[13.5rem] rounded-lg border-border bg-popover p-2 shadow-xl">
        <DropdownMenuItem
          className="min-h-10 cursor-pointer rounded-lg px-3 text-base font-semibold focus:bg-secondary focus:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground"
          onSelect={(event) => {
            event.preventDefault()
            applyPreset()
          }}
        >
          {presetLabel}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-2" />
        <UnitGroup
          label="Temperature"
          value={unitPreferences.temperatureUnit}
          options={temperatureOptions}
          onValueChange={setTemperatureUnit}
        />
        <DropdownMenuSeparator className="my-2" />
        <UnitGroup
          label="Wind Speed"
          value={unitPreferences.windSpeedUnit}
          options={windSpeedOptions}
          onValueChange={setWindSpeedUnit}
        />
        <DropdownMenuSeparator className="my-2" />
        <UnitGroup
          label="Precipitation"
          value={unitPreferences.precipitationUnit}
          options={precipitationOptions}
          onValueChange={setPrecipitationUnit}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

type UnitGroupProps<TValue extends string> = {
  label: string
  value: TValue
  options: UnitOption<TValue>[]
  onValueChange: (value: TValue) => void
}

function UnitGroup<TValue extends string>({
  label,
  value,
  options,
  onValueChange,
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
