import type { SelectedLocation } from "@/hooks/use-selected-location"
import type { SuccessfulApiResponse } from "@/types/api-response"
import type { DashboardNotice } from "@/types/dashboard"
import type { CurrentWeatherSummary, WeatherMetric } from "@/types/forecast"
import { useSelectedLocation } from "@/hooks/use-selected-location"
import { useUnitPreferences } from "@/hooks/use-unit-preferences"
import {
  useFetchWeatherForecast,
  useLatestSuccessfulWeatherForecast,
} from "@/hooks/use-weather-forecast"
import { getCurrentConditionMetrics } from "@/lib/current-conditions"
import { getDashboardNotice } from "@/lib/dashboard-notice"
import {
  formatForecastDate,
  formatTemperature,
  getWeatherSummary,
} from "@/lib/weather"

type UnitControls = ReturnType<typeof useUnitPreferences>

export type WeatherDashboardViewModel = {
  currentWeather: CurrentWeatherSummary
  forecast?: SuccessfulApiResponse
  /** True only before anything renderable exists, so skeletons are shown. */
  isLoading: boolean
  /** True when there is no forecast at all to fall back to. */
  isFullPageError: boolean
  isRetrying: boolean
  metrics: WeatherMetric[]
  notice: DashboardNotice | null
  onRetry: () => void
  onSelectLocation: (location: SelectedLocation) => void
  unitControls: UnitControls
}

/**
 * Single source of truth for the dashboard: resolves the location, fetches the
 * forecast for the active units, and reduces it all to a render-ready view
 * model. A stale-but-successful forecast is preferred over an empty screen, so
 * transient failures degrade to an inline notice rather than a full-page error.
 */
export function useWeatherDashboard(): WeatherDashboardViewModel {
  const {
    isResolvingLocation,
    selectedLocation,
    setSelectedLocation,
  } = useSelectedLocation()
  const unitControls = useUnitPreferences()
  const forecastQuery = useFetchWeatherForecast(
    selectedLocation,
    unitControls.unitPreferences,
  )
  const latestSuccessfulForecast = useLatestSuccessfulWeatherForecast()
  const displayedForecast = forecastQuery.data ?? latestSuccessfulForecast
  const current = displayedForecast?.forecast.current
  const currentUnits = displayedForecast?.forecast.current_units
  const weather = current ? getWeatherSummary(current.weather_code) : null
  const isLoading = !displayedForecast
    && (isResolvingLocation || forecastQuery.isLoading)
  const isFullPageError = forecastQuery.isError
    && !displayedForecast
    && !isLoading

  function retry() {
    void forecastQuery.refetch()
  }

  return {
    currentWeather: {
      date: current ? formatForecastDate(current.time) : undefined,
      icon: weather?.icon,
      locationName: displayedForecast?.location.name,
      temperature: current && currentUnits
        ? formatTemperature(current.temperature_2m, currentUnits.temperature_2m)
        : undefined,
      weatherDescription: weather?.description,
    },
    forecast: displayedForecast?.forecast,
    isFullPageError,
    isLoading,
    isRetrying: forecastQuery.isFetching,
    metrics: getCurrentConditionMetrics(current, currentUnits),
    notice: getDashboardNotice({
      displayedLocation: displayedForecast?.location,
      isForecastError: forecastQuery.isError,
      isForecastFetching: forecastQuery.isFetching,
      isForecastLoading: forecastQuery.isLoading,
      isResolvingLocation,
      onRetry: retry,
      selectedLocation,
    }),
    onRetry: retry,
    onSelectLocation: (location) => {
      void setSelectedLocation(location)
    },
    unitControls,
  }
}
