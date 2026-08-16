import type { SelectedLocation } from "@/hooks/use-selected-location"
import type { DashboardNotice } from "@/types/dashboard"

type DashboardNoticeInput = {
  displayedLocation?: SelectedLocation
  isForecastError: boolean
  isForecastFetching: boolean
  isForecastLoading: boolean
  isResolvingLocation: boolean
  onRetry: () => void
  selectedLocation: SelectedLocation | null
}

type ForecastMessageInput = {
  displayedLocation: SelectedLocation
  selectedLocation: SelectedLocation | null
}

/**
 * Picks the single most relevant inline notice for the dashboard. Every branch
 * requires a displayed location: without one the dashboard renders its own
 * loading or full-page error state instead.
 */
export function getDashboardNotice({
  displayedLocation,
  isForecastError,
  isForecastFetching,
  isForecastLoading,
  isResolvingLocation,
  onRetry,
  selectedLocation,
}: DashboardNoticeInput): DashboardNotice | null {
  if (!displayedLocation) {
    return null
  }

  if (isForecastError) {
    return {
      action: {
        isLoading: isForecastFetching,
        label: "Retry",
        onClick: onRetry,
      },
      message: getStaleForecastMessage({
        displayedLocation,
        selectedLocation,
      }),
      title: "Something went wrong",
      variant: "error",
    }
  }

  if (isForecastLoading) {
    return {
      message: getLoadingForecastMessage({
        displayedLocation,
        selectedLocation,
      }),
      title: "Loading forecast...",
      variant: "loading",
    }
  }

  if (isResolvingLocation) {
    return {
      message: `Showing ${displayedLocation.name} while your location is resolved.`,
      title: "Requesting your current location...",
      variant: "loading",
    }
  }

  return null
}

function getStaleForecastMessage({
  displayedLocation,
  selectedLocation,
}: ForecastMessageInput) {
  if (selectedLocation && selectedLocation.name !== displayedLocation.name) {
    return `We couldn't load ${selectedLocation.name}. Showing latest forecast for ${displayedLocation.name}.`
  }

  return "We couldn't connect to the server. Showing the latest loaded forecast."
}

function getLoadingForecastMessage({
  displayedLocation,
  selectedLocation,
}: ForecastMessageInput) {
  if (selectedLocation && selectedLocation.name !== displayedLocation.name) {
    return `Showing ${displayedLocation.name} while ${selectedLocation.name} loads.`
  }

  return "Updating the displayed forecast."
}
