import type { SelectedLocation } from "@/hooks/use-selected-location"
import type {
  GeocodingResponse,
  LocationSuggestion,
  OpenMeteoGeocodingResult,
} from "@/types/geocoding"
import { SEARCH_MAX_RESULTS } from "@/constants/search"

const OPEN_METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1/search"

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
    label: formatLocationLabel(result),
    city: result.name,
    admin1: result.admin1,
    country: result.country,
    latitude: result.latitude,
    longitude: result.longitude,
    timezone: result.timezone as string,
  }
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
