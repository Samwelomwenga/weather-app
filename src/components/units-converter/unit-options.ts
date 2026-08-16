import type {
  PrecipitationUnit,
  TemperatureUnit,
  WindSpeedUnit,
} from "@/lib/units"

export type UnitOption<TValue extends string> = {
  label: string
  value: TValue
}

export const temperatureOptions = [
  { label: "Celsius (°C)", value: "celsius" },
  { label: "Fahrenheit (°F)", value: "fahrenheit" },
] satisfies UnitOption<TemperatureUnit>[]

export const windSpeedOptions = [
  { label: "km/h", value: "kmh" },
  { label: "mph", value: "mph" },
] satisfies UnitOption<WindSpeedUnit>[]

export const precipitationOptions = [
  { label: "Millimeters (mm)", value: "mm" },
  { label: "Inches (in)", value: "inch" },
] satisfies UnitOption<PrecipitationUnit>[]
