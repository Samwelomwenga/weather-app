import type { inferParserType, UrlKeys } from "nuqs"
import {
  parseAsFloat,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"
import { useCallback, useEffect, useMemo } from "react"
import { useGeolocation } from "@/hooks/use-geolocation"

const locationSources = ["current", "fallback", "search"] as const

export type LocationSource = typeof locationSources[number]

export type SelectedLocation = {
  latitude: number
  longitude: number
  timezone: string
  name: string
  source: LocationSource
}

export const BERLIN_LOCATION: SelectedLocation = {
  latitude: 52.52,
  longitude: 13.41,
  timezone: "Europe/Berlin",
  name: "Berlin, Germany",
  source: "fallback",
}

const selectedLocationParsers = {
  latitude: parseAsFloat,
  longitude: parseAsFloat,
  timezone: parseAsString,
  name: parseAsString,
  source: parseAsStringLiteral(locationSources),
}

const selectedLocationUrlKeys = {
  latitude: "lat",
  longitude: "lon",
  timezone: "tz",
  name: "place",
  source: "source",
} satisfies UrlKeys<typeof selectedLocationParsers>

type UrlSelectedLocation = inferParserType<typeof selectedLocationParsers>

export function useSelectedLocation() {
  const [urlLocation, setUrlLocation] = useQueryStates(
    selectedLocationParsers,
    {
      clearOnDefault: false,
      history: "replace",
      shallow: true,
      urlKeys: selectedLocationUrlKeys,
    },
  )
  const selectedLocation = useMemo(
    () => parseSelectedLocation(urlLocation),
    [urlLocation],
  )
  const setSelectedLocation = useCallback(
    (location: SelectedLocation) => setUrlLocation(location),
    [setUrlLocation],
  )
  const geolocation = useGeolocation({ enabled: selectedLocation === null })

  useEffect(() => {
    if (selectedLocation !== null) {
      return
    }

    if (geolocation.data) {
      void setUrlLocation({
        latitude: geolocation.data.latitude,
        longitude: geolocation.data.longitude,
        timezone: getBrowserTimezone(),
        name: "Current location",
        source: "current",
      })
      return
    }

    if (geolocation.isError) {
      void setUrlLocation(BERLIN_LOCATION)
    }
  }, [
    geolocation.data,
    geolocation.isError,
    selectedLocation,
    setUrlLocation,
  ])

  return {
    selectedLocation,
    setSelectedLocation,
    isResolvingLocation: selectedLocation === null && geolocation.isPending,
    isUsingFallback: selectedLocation?.source === "fallback",
  }
}

function parseSelectedLocation(
  location: UrlSelectedLocation,
): SelectedLocation | null {
  const { latitude, longitude, timezone, name, source } = location

  if (
    latitude === null
    || longitude === null
    || timezone === null
    || name === null
    || source === null
    || !isValidLatitude(latitude)
    || !isValidLongitude(longitude)
  ) {
    return null
  }

  return {
    latitude,
    longitude,
    timezone,
    name,
    source,
  }
}

function getBrowserTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
}

function isValidLatitude(value: number) {
  return Number.isFinite(value) && value >= -90 && value <= 90
}

function isValidLongitude(value: number) {
  return Number.isFinite(value) && value >= -180 && value <= 180
}
