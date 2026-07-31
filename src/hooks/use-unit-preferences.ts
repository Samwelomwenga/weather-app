import type { inferParserType, UrlKeys } from "nuqs"
import type {
  PrecipitationUnit,
  TemperatureUnit,
  UnitPreferences,
  WindSpeedUnit,
} from "@/lib/units"
import {
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"
import { useCallback } from "react"
import {
  imperialUnitPreferences,
  metricUnitPreferences,
  precipitationUnits,
  temperatureUnits,
  windSpeedUnits,
} from "@/lib/units"

const unitPreferenceParsers = {
  temperatureUnit: parseAsStringLiteral(temperatureUnits)
    .withDefault(metricUnitPreferences.temperatureUnit),
  windSpeedUnit: parseAsStringLiteral(windSpeedUnits)
    .withDefault(metricUnitPreferences.windSpeedUnit),
  precipitationUnit: parseAsStringLiteral(precipitationUnits)
    .withDefault(metricUnitPreferences.precipitationUnit),
}

const unitPreferenceUrlKeys = {
  temperatureUnit: "temp",
  windSpeedUnit: "wind",
  precipitationUnit: "precip",
} satisfies UrlKeys<typeof unitPreferenceParsers>

type UrlUnitPreferences = inferParserType<typeof unitPreferenceParsers>

export function useUnitPreferences() {
  const [unitPreferences, setUnitPreferences] = useQueryStates(
    unitPreferenceParsers,
    {
      clearOnDefault: false,
      history: "replace",
      shallow: true,
      urlKeys: unitPreferenceUrlKeys,
    },
  )
  const setTemperatureUnit = useCallback(
    (temperatureUnit: TemperatureUnit) => {
      void setUnitPreferences({ temperatureUnit })
    },
    [setUnitPreferences],
  )
  const setWindSpeedUnit = useCallback(
    (windSpeedUnit: WindSpeedUnit) => {
      void setUnitPreferences({ windSpeedUnit })
    },
    [setUnitPreferences],
  )
  const setPrecipitationUnit = useCallback(
    (precipitationUnit: PrecipitationUnit) => {
      void setUnitPreferences({ precipitationUnit })
    },
    [setUnitPreferences],
  )
  const setMetricUnits = useCallback(() => {
    void setUnitPreferences(metricUnitPreferences)
  }, [setUnitPreferences])
  const setImperialUnits = useCallback(() => {
    void setUnitPreferences(imperialUnitPreferences)
  }, [setUnitPreferences])

  return {
    unitPreferences: toUnitPreferences(unitPreferences),
    setTemperatureUnit,
    setWindSpeedUnit,
    setPrecipitationUnit,
    setMetricUnits,
    setImperialUnits,
  }
}

function toUnitPreferences(
  preferences: UrlUnitPreferences,
): UnitPreferences {
  return {
    temperatureUnit: preferences.temperatureUnit,
    windSpeedUnit: preferences.windSpeedUnit,
    precipitationUnit: preferences.precipitationUnit,
  }
}
