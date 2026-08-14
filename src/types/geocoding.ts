export type LocationSuggestion = {
  id: string
  /** Full "City, Admin1, Country" label — becomes the selected location's name. */
  label: string
  city: string
  admin1?: string
  country?: string
  latitude: number
  longitude: number
  timezone: string
}

export type OpenMeteoGeocodingResult = {
  id?: number
  name: string
  latitude: number
  longitude: number
  timezone?: string
  country?: string
  admin1?: string
}

export type GeocodingResponse = {
  results?: OpenMeteoGeocodingResult[]
  error?: boolean
  reason?: string
}
