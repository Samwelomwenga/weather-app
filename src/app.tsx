import type { SuccessfulApiResponse } from "./types/api-response"
import { useCallback, useState } from "react"
import todayCardBackground from "@/assets/images/bg-today-large.svg"
import { HourlyForecast } from "./components/hourly-forecast"
import { Logo } from "./components/logo"
import Provider from "./components/provider"
import { SearchInput } from "./components/search-input"
import { Button } from "./components/ui/button"
import { Skeleton } from "./components/ui/skeleton"
import { UnitsConverter } from "./components/units-converter"
import {
  isLocationSearchNoResultsError,
  useLocationSearch,
} from "./hooks/use-location-search"
import { useSelectedLocation } from "./hooks/use-selected-location"
import { useFetchWeatherForecast } from "./hooks/use-weather-forecast"
import {
  formatForecastDate,
  formatMeasurement,
  formatTemperature,
  getWeatherSummary,
} from "./lib/weather"

type SearchFeedback
  = | { type: "idle" }
    | { type: "no-results", query: string }
    | { type: "error", message: string }

function App() {
  return (
    <Provider>
      <WeatherDashboard />
    </Provider>
  )
}

function WeatherDashboard() {
  const {
    isResolvingLocation,
    isUsingFallback,
    selectedLocation,
    setSelectedLocation,
  } = useSelectedLocation()
  const [searchFeedback, setSearchFeedback] = useState<SearchFeedback>({
    type: "idle",
  })
  const {
    isPending: isSearchingLocation,
    mutate: searchLocation,
  } = useLocationSearch()
  const forecast = useFetchWeatherForecast(selectedLocation)
  const current = forecast.data?.current
  const currentUnits = forecast.data?.current_units
  const weather = current ? getWeatherSummary(current.weather_code) : null
  const searchErrorMessage = searchFeedback.type === "error"
    ? searchFeedback.message
    : undefined
  const isShowingNoResults = searchFeedback.type === "no-results"
  const statusMessage = getStatusMessage({
    isForecastError: forecast.isError,
    isForecastLoading: forecast.isLoading,
    isResolvingLocation,
    isUsingFallback,
  })
  const handleLocationSearch = useCallback((query: string) => {
    setSearchFeedback({ type: "idle" })
    searchLocation(query, {
      onError: (error) => {
        if (isLocationSearchNoResultsError(error)) {
          setSearchFeedback({ type: "no-results", query })
          return
        }

        setSearchFeedback({
          type: "error",
          message: "Location search failed. Try again.",
        })
      },
      onSuccess: (location) => {
        void setSelectedLocation(location)
        setSearchFeedback({ type: "idle" })
      },
    })
  }, [searchLocation, setSelectedLocation])

  return (
    <main className="min-h-screen px-4 py-6 text-left sm:px-8 lg:py-12">
      <div className="mx-auto flex w-full max-w-[1216px] flex-col gap-10">
        <header className="flex items-center justify-between gap-4">
          <Logo />
          <UnitsConverter />
        </header>

        <section className="mx-auto flex w-full max-w-[656px] flex-col items-center gap-8 text-center">
          <h1 className="font-display text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
            How&apos;s the sky looking today?
          </h1>
          <SearchInput
            errorMessage={searchErrorMessage}
            isSearching={isSearchingLocation}
            onSearch={handleLocationSearch}
          />
        </section>

        {statusMessage && !isShowingNoResults && (
          <p className="mx-auto w-full max-w-[656px] rounded-lg border border-border bg-card px-4 py-3 text-sm text-muted-foreground">
            {statusMessage}
          </p>
        )}

        {isShowingNoResults
          ? (
              <NoSearchResults query={searchFeedback.query} />
            )
          : (
              <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(22rem,1fr)]">
                <div className="flex flex-col gap-8">
                  {forecast.isError
                    ? (
                        <ForecastErrorCard onRetry={() => void forecast.refetch()} />
                      )
                    : (
                        <CurrentWeatherCard
                          date={current && forecast.data
                            ? formatForecastDate(current.time)
                            : undefined}
                          icon={weather?.icon}
                          locationName={selectedLocation?.name}
                          temperature={current && currentUnits
                            ? formatTemperature(
                                current.temperature_2m,
                                currentUnits.temperature_2m,
                              )
                            : undefined}
                          weatherDescription={weather?.description}
                        />
                      )}

                  <MetricGrid
                    current={current}
                    units={currentUnits}
                  />
                </div>

                <HourlyForecast
                  forecast={forecast.data}
                  isLoading={isResolvingLocation || forecast.isLoading}
                />
              </section>
            )}
      </div>
    </main>
  )
}

type NoSearchResultsProps = {
  query: string
}

function NoSearchResults({ query }: NoSearchResultsProps) {
  return (
    <p
      className="py-2 text-center text-2xl font-bold"
      role="status"
      aria-live="polite"
      aria-label={`No search result found for ${query}`}
    >
      No search result found!
    </p>
  )
}

type CurrentWeatherCardProps = {
  date?: string
  icon?: string
  locationName?: string
  temperature?: string
  weatherDescription?: string
}

function CurrentWeatherCard({
  date,
  icon,
  locationName,
  temperature,
  weatherDescription,
}: CurrentWeatherCardProps) {
  return (
    <article
      className="flex min-h-[17.75rem] flex-col justify-between overflow-hidden rounded-lg bg-blue-500 bg-cover bg-center p-6 sm:p-8 lg:min-h-[18rem]"
      style={{ backgroundImage: `url(${todayCardBackground})` }}
    >
      <div>
        {locationName
          ? (
              <h2 className="text-2xl font-bold sm:text-3xl">{locationName}</h2>
            )
          : (
              <Skeleton className="h-9 w-64 bg-neutral-0/20" />
            )}

        {date
          ? (
              <p className="mt-2 text-base font-medium text-neutral-0/85">{date}</p>
            )
          : (
              <Skeleton className="mt-3 h-5 w-48 bg-neutral-0/20" />
            )}
      </div>

      <div className="flex items-end justify-between gap-6">
        {icon && weatherDescription
          ? (
              <img
                src={icon}
                alt={weatherDescription}
                className="h-20 w-20 object-contain sm:h-24 sm:w-24"
              />
            )
          : (
              <Skeleton className="h-20 w-20 rounded-full bg-neutral-0/20 sm:h-24 sm:w-24" />
            )}

        {temperature
          ? (
              <p className="text-7xl leading-none font-bold sm:text-8xl">
                {temperature}
              </p>
            )
          : (
              <Skeleton className="h-20 w-36 bg-neutral-0/20" />
            )}
      </div>
    </article>
  )
}

type MetricGridProps = {
  current: SuccessfulApiResponse["current"] | undefined
  units: SuccessfulApiResponse["current_units"] | undefined
}

function MetricGrid({ current, units }: MetricGridProps) {
  const metrics = [
    {
      label: "Feels Like",
      value: current && units
        ? formatTemperature(current.apparent_temperature, units.temperature_2m)
        : undefined,
    },
    {
      label: "Humidity",
      value: current && units
        ? formatMeasurement(
            current.relative_humidity_2m,
            units.relative_humidity_2m,
          )
        : undefined,
    },
    {
      label: "Wind",
      value: current && units
        ? formatMeasurement(current.wind_speed_10m, units.wind_speed_10m)
        : undefined,
    },
    {
      label: "Precipitation",
      value: current && units
        ? formatMeasurement(current.precipitation, units.precipitation)
        : undefined,
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(metric => (
        <article
          key={metric.label}
          className="min-h-32 rounded-lg border border-border bg-card p-5"
        >
          <p className="font-medium text-muted-foreground">{metric.label}</p>
          {metric.value
            ? (
                <p className="mt-6 text-3xl font-semibold">{metric.value}</p>
              )
            : (
                <Skeleton className="mt-7 h-9 w-24" />
              )}
        </article>
      ))}
    </div>
  )
}

type ForecastErrorCardProps = {
  onRetry: () => void
}

function ForecastErrorCard({ onRetry }: ForecastErrorCardProps) {
  return (
    <article className="flex min-h-[17.75rem] flex-col items-start justify-center gap-4 rounded-lg border border-border bg-card p-6 sm:p-8">
      <div>
        <h2 className="text-2xl font-bold">Forecast unavailable</h2>
        <p className="mt-2 max-w-md text-base text-muted-foreground">
          The weather service could not return a forecast for the selected
          location.
        </p>
      </div>
      <Button onClick={onRetry}>Retry</Button>
    </article>
  )
}

type StatusMessageInput = {
  isForecastError: boolean
  isForecastLoading: boolean
  isResolvingLocation: boolean
  isUsingFallback: boolean
}

function getStatusMessage({
  isForecastError,
  isForecastLoading,
  isResolvingLocation,
  isUsingFallback,
}: StatusMessageInput) {
  if (isResolvingLocation) {
    return "Requesting your current location..."
  }

  if (isForecastLoading) {
    return "Loading forecast..."
  }

  if (isForecastError) {
    return "Forecast loading failed."
  }

  if (isUsingFallback) {
    return "Using Berlin because current location is unavailable."
  }

  return null
}

export default App
