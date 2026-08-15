import type { SelectedLocation } from "@/hooks/use-selected-location"
import type {
  BigDataCloudReverseResult,
  GeocodingResponse,
  LocationSuggestion,
  OpenMeteoGeocodingResult,
} from "@/types/geocoding"
import { SEARCH_MAX_RESULTS } from "@/constants/search"

const OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

const BIG_DATA_CLOUD_REVERSE_URL
  = "https://api.bigdatacloud.net/data/reverse-geocode-client"

/** Forward-geocode a place name into up to `SEARCH_MAX_RESULTS` suggestions. */
export async function searchLocations(
  query: string,
): Promise<LocationSuggestion[]> {
  const searchParams = new URLSearchParams({
    count: String(SEARCH_MAX_RESULTS),
    format: "json",
    language: "en",
    name: query,
  })
  const response = await fetch(`${OPEN_METEO_GEOCODING_URL}?${searchParams}`)
  const data = await response.json() as GeocodingResponse

  if (!response.ok || data.error) {
    throw new Error(data.reason ?? "Failed to load location suggestions")
  }

  return (data.results ?? [])
    .filter(
      result =>
        Number.isFinite(result.latitude)
        && Number.isFinite(result.longitude)
        && Boolean(result.timezone),
    )
    .map(toSuggestion)
}

/**
 * Reverse-geocode coordinates into a "City, Admin1, Country" label via
 * BigDataCloud's keyless, CORS-enabled client endpoint (SAM-105). Returns null
 * when the lookup yields no usable place name so callers can fall back to
 * "Current location".
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<string | null> {
  const searchParams = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    localityLanguage: "en",
  })
  const response = await fetch(`${BIG_DATA_CLOUD_REVERSE_URL}?${searchParams}`)

  if (!response.ok) {
    throw new Error("Failed to reverse-geocode the current location")
  }

  const data = await response.json() as BigDataCloudReverseResult
  const label = formatLocationLabel([
    data.city || data.locality,
    data.principalSubdivision,
    data.countryName,
  ])

  return label || null
}

export function suggestionToLocation(
  suggestion: LocationSuggestion,
): SelectedLocation {
  return {
    latitude: suggestion.latitude,
    longitude: suggestion.longitude,
    timezone: suggestion.timezone,
    name: suggestion.label,
    source: "search",
  }
}

function toSuggestion(result: OpenMeteoGeocodingResult): LocationSuggestion {
  return {
    id: String(result.id ?? `${result.latitude},${result.longitude}`),
    label: formatLocationLabel([result.name, result.admin1, result.country]),
    city: result.name,
    admin1: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone as string,
  }
}

function formatLocationLabel(parts: Array<string | undefined>) {
  return parts
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
