import type { SelectedLocation } from "@/hooks/use-selected-location"
import { useMutation } from "@tanstack/react-query"

const OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

type OpenMeteoGeocodingResult = {
  name: string
  latitude: number
  longitude: number
  timezone?: string
  country?: string
  admin1?: string
}

type SuccessfulGeocodingResponse = {
  results?: OpenMeteoGeocodingResult[]
}

type ErrorGeocodingResponse = {
  error: boolean
  reason?: string
}

type GeocodingResponse = SuccessfulGeocodingResponse | ErrorGeocodingResponse

export function useLocationSearch() {
  return useMutation<SelectedLocation, Error, string>({
    mutationFn: searchLocation,
  })
}

export function isLocationSearchNoResultsError(error: unknown) {
  return error instanceof Error && error.name === "LocationSearchNoResultsError"
}

async function searchLocation(query: string): Promise<SelectedLocation> {
  const normalizedQuery = query.trim()

  if (!normalizedQuery) {
    throw createNoResultsError(query)
  }

  const searchParams = new URLSearchParams({
    count: "1",
    format: "json",
    language: "en",
    name: normalizedQuery,
  })
  const response = await fetch(`${OPEN_METEO_GEOCODING_URL}?${searchParams}`)
  const data = await response.json() as GeocodingResponse

  if (!response.ok || isGeocodingError(data)) {
    throw new Error(getGeocodingErrorMessage(data))
  }

  const [result] = data.results ?? []

  if (!result) {
    throw createNoResultsError(normalizedQuery)
  }

  if (
    !Number.isFinite(result.latitude)
    || !Number.isFinite(result.longitude)
    || !result.timezone
  ) {
    throw new Error("Location search returned incomplete location data")
  }

  return {
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone,
    name: formatLocationLabel(result),
    source: "search",
  }
}

function isGeocodingError(
  data: GeocodingResponse,
): data is ErrorGeocodingResponse {
  return "error" in data && data.error
}

function getGeocodingErrorMessage(data: GeocodingResponse) {
  if (isGeocodingError(data) && data.reason) {
    return data.reason
  }

  return "Failed to search for the location"
}

function createNoResultsError(query: string) {
  const error = new Error(`No search result found for "${query}"`)
  error.name = "LocationSearchNoResultsError"
  return error
}

function formatLocationLabel(result: OpenMeteoGeocodingResult) {
  return [result.name, result.admin1, result.country]
    .filter(isUniquePresentLocationPart)
    .join(", ")
}

function isUniquePresentLocationPart(
  value: string | undefined,
  index: number,
  values: Array<string | undefined>,
) {
  if (!value) {
    return false
  }

  const normalizedValue = value.toLocaleLowerCase()

  return values.findIndex(
    item => item?.toLocaleLowerCase() === normalizedValue,
  ) === index
}
