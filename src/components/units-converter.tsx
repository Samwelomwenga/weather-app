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
          className="h-11 rounded-lg px-4 text-base"
          aria-label="Change measurement units"
        >
          <img src={iconUnits} alt="" className="h-5 w-5" />
          <span>Units</span>
          <img src={iconDropdown} alt="" className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 rounded-lg p-2">
        <DropdownMenuItem
          className="min-h-10 rounded-lg px-3 text-base font-semibold"
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
          className="min-h-10 rounded-lg text-base data-[state=checked]:bg-secondary"
          onCheckedChange={() => onValueChange(option.value)}
          onSelect={event => event.preventDefault()}
        >
          {option.label}
        </DropdownMenuCheckboxItem>
      ))}
    </DropdownMenuGroup>
  )
}
