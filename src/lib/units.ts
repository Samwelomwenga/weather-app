export const temperatureUnits = ["celsius", "fahrenheit"] as const
export const windSpeedUnits = ["kmh", "mph"] as const
export const precipitationUnits = ["mm", "inch"] as const

export type TemperatureUnit = typeof temperatureUnits[number]
export type WindSpeedUnit = typeof windSpeedUnits[number]
export type PrecipitationUnit = typeof precipitationUnits[number]

export type UnitPreferences = {
  temperatureUnit: TemperatureUnit
  windSpeedUnit: WindSpeedUnit
  precipitationUnit: PrecipitationUnit
}

export const metricUnitPreferences = {
  temperatureUnit: "celsius",
  windSpeedUnit: "kmh",
  precipitationUnit: "mm",
} satisfies UnitPreferences

export const imperialUnitPreferences = {
  temperatureUnit: "fahrenheit",
  windSpeedUnit: "mph",
  precipitationUnit: "inch",
} satisfies UnitPreferences

export function areUnitPreferencesEqual(
  first: UnitPreferences,
  second: UnitPreferences,
) {
  return (
    first.temperatureUnit === second.temperatureUnit
    && first.windSpeedUnit === second.windSpeedUnit
    && first.precipitationUnit === second.precipitationUnit
  )
}
