import type { inferParserType, UrlKeys } from "nuqs"
import { useQuery } from "@tanstack/react-query"
import {
  parseAsFloat,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs"
import { useEffect } from "react"
import { queryKeys } from "@/constants/query-keys"
import { useGeolocation } from "@/hooks/use-geolocation"
import { reverseGeocode } from "@/lib/geocoding"

const locationSources = ["current", "fallback", "search"] as const

const CURRENT_LOCATION_NAME = "Current location"

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
  const selectedLocation = parseSelectedLocation(urlLocation)
  const setSelectedLocation = (location: SelectedLocation) =>
    setUrlLocation(location)
  const geolocation = useGeolocation({ enabled: selectedLocation === null })

  // Once geolocation succeeds, turn the raw coordinates into a display name
  // before committing the location, so the current-weather card fetches and
  // renders once with the real place name (no "Current location" flash).
  const needsPlaceName = selectedLocation === null && geolocation.data != null
  const placeName = useQuery({
    queryKey: [
      ...queryKeys.reverseGeocode,
      geolocation.data?.latitude,
      geolocation.data?.longitude,
    ],
    queryFn: () =>
      reverseGeocode(geolocation.data!.latitude, geolocation.data!.longitude),
    enabled: needsPlaceName,
    retry: false,
    staleTime: Infinity,
  })
  const isResolvingPlaceName
    = needsPlaceName && !placeName.isSuccess && !placeName.isError

  useEffect(() => {
    if (selectedLocation !== null) {
      return
    }

    if (geolocation.isError) {
      void setUrlLocation(BERLIN_LOCATION)
      return
    }

    if (!geolocation.data || isResolvingPlaceName) {
      return
    }

    void setUrlLocation({
      latitude: geolocation.data.latitude,
      longitude: geolocation.data.longitude,
      timezone: getBrowserTimezone(),
      // Fall back to "Current location" when reverse geocoding fails or
      // returns nothing (SAM-105 agreed behavior).
      name: placeName.data || CURRENT_LOCATION_NAME,
      source: "current",
    })
  }, [
    geolocation.data,
    geolocation.isError,
    isResolvingPlaceName,
    placeName.data,
    selectedLocation,
    setUrlLocation,
  ])

  return {
    selectedLocation,
    setSelectedLocation,
    isResolvingLocation:
      selectedLocation === null
      && (geolocation.isPending || isResolvingPlaceName),
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
