import type { CSSProperties } from "react"
import type { SelectedLocation } from "./hooks/use-selected-location"
import type { SuccessfulApiResponse } from "./types/api-response"
import todayCardBackground from "@/assets/images/bg-today-large.svg"
import todayCardBackgroundSmall from "@/assets/images/bg-today-small.svg"
import ErrorIcon from "@/assets/images/icon-error.svg"
import LoadingIcon from "@/assets/images/icon-loading.svg"
import RetryIcon from "@/assets/images/icon-retry.svg"
import { DailyForecast } from "./components/daily-forecast"
import { HourlyForecast } from "./components/hourly-forecast"
import { Logo } from "./components/logo"
import Provider from "./components/provider"
import { SearchCombobox } from "./components/search-combobox"
import { Button } from "./components/ui/button"
import { Skeleton } from "./components/ui/skeleton"
import { UnitsConverter } from "./components/units-converter"
import { useSelectedLocation } from "./hooks/use-selected-location"
import { useUnitPreferences } from "./hooks/use-unit-preferences"
import {
  useFetchWeatherForecast,
  useLatestSuccessfulWeatherForecast,
} from "./hooks/use-weather-forecast"
import {
  formatForecastDate,
  formatMeasurement,
  formatTemperature,
  getWeatherSummary,
} from "./lib/weather"

type DashboardNotice = {
  title: string
  message?: string
  icon?: string
  role?: "alert" | "status"
  action?: {
    isLoading?: boolean
    label: string
    onClick: () => void
  }
}

const todayCardStyle = {
  "--today-card-bg-large": `url(${todayCardBackground})`,
  "--today-card-bg-small": `url(${todayCardBackgroundSmall})`,
} as CSSProperties

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
    selectedLocation,
    setSelectedLocation,
  } = useSelectedLocation()
  const unitControls = useUnitPreferences()
  const forecast = useFetchWeatherForecast(
    selectedLocation,
    unitControls.unitPreferences,
  )
  const latestSuccessfulForecast = useLatestSuccessfulWeatherForecast()
  const displayedForecast = forecast.data ?? latestSuccessfulForecast
  const current = displayedForecast?.forecast.current
  const currentUnits = displayedForecast?.forecast.current_units
  const weather = current ? getWeatherSummary(current.weather_code) : null
  const isDashboardLoading = !displayedForecast
    && (isResolvingLocation || forecast.isLoading)
  const isFullPageForecastError = forecast.isError
    && !displayedForecast
    && !isDashboardLoading
  const dashboardNotice = getDashboardNotice({
    displayedLocation: displayedForecast?.location,
    isForecastError: forecast.isError,
    isForecastFetching: forecast.isFetching,
    isForecastLoading: forecast.isLoading,
    isResolvingLocation,
    onRetry: () => void forecast.refetch(),
    selectedLocation,
  })

  return (
    <main className="min-h-screen px-4 py-4 text-left sm:px-8 sm:py-6">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-8 lg:gap-10">
        <header className="flex items-center justify-between gap-4">
          <Logo />
          <UnitsConverter {...unitControls} />
        </header>

        {!isFullPageForecastError && (
          <section className="mx-auto flex w-full max-w-164 flex-col items-center gap-8 pt-2 text-center lg:gap-12">
            <h1 className="max-w-[12ch] font-display text-[2.5rem] leading-[1.15] font-bold text-balance sm:max-w-none sm:text-5xl lg:text-6xl">
              How&apos;s the sky looking today?
            </h1>
            <SearchCombobox
              onSelect={location => void setSelectedLocation(location)}
            />
          </section>
        )}

        {isFullPageForecastError
          ? (
              <ForecastErrorState
                isRetrying={forecast.isFetching}
                onRetry={() => void forecast.refetch()}
              />
            )
          : (
              <>
                {dashboardNotice && (
                  <DashboardStateNotice notice={dashboardNotice} />
                )}

                <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(22rem,1fr)]">
                  <div className="flex flex-col gap-8">
                    <CurrentWeatherCard
                      date={current && displayedForecast
                        ? formatForecastDate(current.time)
                        : undefined}
                      icon={weather?.icon}
                      isLoading={isDashboardLoading}
                      locationName={displayedForecast?.location.name}
                      temperature={current && currentUnits
                        ? formatTemperature(
                            current.temperature_2m,
                            currentUnits.temperature_2m,
                          )
                        : undefined}
                      weatherDescription={weather?.description}
                    />

                    <MetricGrid
                      current={current}
                      isLoading={isDashboardLoading}
                      units={currentUnits}
                    />

                    <DailyForecast
                      forecast={displayedForecast?.forecast}
                      isLoading={isDashboardLoading}
                    />
                  </div>

                  <HourlyForecast
                    forecast={displayedForecast?.forecast}
                    isLoading={isDashboardLoading}
                  />
                </section>
              </>
            )}
      </div>
    </main>
  )
}

type DashboardStateNoticeProps = {
  notice: DashboardNotice
}

function DashboardStateNotice({ notice }: DashboardStateNoticeProps) {
  return (
    <section
      className="mx-auto flex w-full max-w-164 flex-col gap-3 rounded-lg border border-border bg-card px-4 py-3 text-left sm:flex-row sm:items-start"
      role={notice.role ?? "status"}
      aria-live={notice.role === "alert" ? "assertive" : "polite"}
    >
      {notice.icon && (
        <img
          src={notice.icon}
          alt=""
          className="mt-1 h-5 w-5 shrink-0"
        />
      )}
      <div className="min-w-0 flex-1">
        <h2 className="text-base font-bold">{notice.title}</h2>
        {notice.message && (
          <p className="mt-1 text-sm text-muted-foreground">
            {notice.message}
          </p>
        )}
      </div>
      {notice.action && (
        <Button
          variant="secondary"
          size="sm"
          className="shrink-0 self-start focus-visible:ring-2 focus-visible:ring-neutral-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          disabled={notice.action.isLoading}
          onClick={notice.action.onClick}
        >
          <img src={RetryIcon} alt="" className="h-4 w-4" />
          {notice.action.isLoading ? "Retrying..." : notice.action.label}
        </Button>
      )}
    </section>
  )
}

type ForecastErrorStateProps = {
  isRetrying: boolean
  onRetry: () => void
}

function ForecastErrorState({ isRetrying, onRetry }: ForecastErrorStateProps) {
  return (
    <section
      className="mx-auto flex min-h-[34rem] max-w-[42rem] flex-col items-center justify-center text-center"
      role="alert"
      aria-live="assertive"
    >
      <img src={ErrorIcon} alt="" className="h-12 w-12" />
      <h1 className="mt-8 font-display text-4xl leading-tight font-bold text-balance sm:text-5xl">
        Something went wrong
      </h1>
      <p className="mt-5 max-w-[36rem] text-lg font-medium text-muted-foreground">
        We couldn&apos;t connect to the server. Please try again in a few
        moments.
      </p>
      <Button
        variant="secondary"
        className="mt-8 focus-visible:ring-2 focus-visible:ring-neutral-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        disabled={isRetrying}
        onClick={onRetry}
      >
        <img src={RetryIcon} alt="" className="h-4 w-4" />
        {isRetrying ? "Retrying..." : "Retry"}
      </Button>
    </section>
  )
}

type CurrentWeatherCardProps = {
  date?: string
  icon?: string
  isLoading?: boolean
  locationName?: string
  temperature?: string
  weatherDescription?: string
}

function CurrentWeatherCard({
  date,
  icon,
  isLoading = false,
  locationName,
  temperature,
  weatherDescription,
}: CurrentWeatherCardProps) {
  return (
    <article
      className="flex min-h-[15.25rem] flex-col justify-between overflow-hidden rounded-lg bg-blue-500 bg-[image:var(--today-card-bg-small)] bg-cover bg-center p-6 text-center sm:min-h-[17.75rem] sm:bg-[image:var(--today-card-bg-large)] sm:p-8 sm:text-left lg:min-h-[18rem]"
      style={todayCardStyle}
      role={isLoading ? "status" : undefined}
      aria-live={isLoading ? "polite" : undefined}
      aria-busy={isLoading || undefined}
    >
      <div>
        {locationName
          ? (
              <h2 className="break-words text-2xl font-bold sm:text-3xl">{locationName}</h2>
            )
          : (
              <Skeleton className="mx-auto h-9 w-56 max-w-full bg-neutral-0/20 sm:mx-0 sm:w-64" />
            )}

        {date
          ? (
              <p className="mt-2 text-base font-medium text-neutral-0/85">{date}</p>
            )
          : (
              <Skeleton className="mx-auto mt-3 h-5 w-48 max-w-full bg-neutral-0/20 sm:mx-0" />
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
  isLoading?: boolean
  units: SuccessfulApiResponse["current_units"] | undefined
}

function MetricGrid({
  current,
  isLoading = false,
  units,
}: MetricGridProps) {
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
    <div className="grid gap-4 sm:grid-cols-2 lg:gap-6 xl:grid-cols-4">
      {metrics.map(metric => (
        <article
          key={metric.label}
          className="min-h-[6.25rem] rounded-lg border border-border bg-card p-4 transition-colors hover:border-neutral-300/50 hover:bg-neutral-700 sm:min-h-32 sm:p-5"
        >
          <p className="font-medium text-muted-foreground">{metric.label}</p>
          {metric.value
            ? (
                <p className="mt-4 text-3xl font-semibold sm:mt-6">{metric.value}</p>
              )
            : (
                <MetricValueFallback
                  isLoading={isLoading}
                  label={metric.label}
                />
              )}
        </article>
      ))}
    </div>
  )
}

type MetricValueFallbackProps = {
  isLoading: boolean
  label: string
}

function MetricValueFallback({
  isLoading,
  label,
}: MetricValueFallbackProps) {
  if (isLoading) {
    return (
      <p
        className="mt-4 text-3xl font-semibold sm:mt-6"
        aria-label={`${label} loading`}
      >
        -
      </p>
    )
  }

  return <Skeleton className="mt-5 h-9 w-24 sm:mt-7" />
}

type DashboardNoticeInput = {
  displayedLocation?: SelectedLocation
  isForecastError: boolean
  isForecastFetching: boolean
  isForecastLoading: boolean
  isResolvingLocation: boolean
  onRetry: () => void
  selectedLocation: SelectedLocation | null
}

function getDashboardNotice({
  displayedLocation,
  isForecastError,
  isForecastFetching,
  isForecastLoading,
  isResolvingLocation,
  onRetry,
  selectedLocation,
}: DashboardNoticeInput): DashboardNotice | null {
  if (isForecastError && displayedLocation) {
    return {
      title: "Something went wrong",
      message: getStaleForecastMessage({
        displayedLocation,
        selectedLocation,
      }),
      icon: ErrorIcon,
      role: "alert",
      action: {
        isLoading: isForecastFetching,
        label: "Retry",
        onClick: onRetry,
      },
    }
  }

  if (isForecastLoading && displayedLocation) {
    return {
      title: "Loading forecast...",
      message: getLoadingForecastMessage({
        displayedLocation,
        selectedLocation,
      }),
      icon: LoadingIcon,
      role: "status",
    }
  }

  if (isResolvingLocation && displayedLocation) {
    return {
      title: "Requesting your current location...",
      message: `Showing ${displayedLocation.name} while your location is resolved.`,
      icon: LoadingIcon,
      role: "status",
    }
  }

  return null
}

type ForecastMessageInput = {
  displayedLocation: SelectedLocation
  selectedLocation: SelectedLocation | null
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

export default App
