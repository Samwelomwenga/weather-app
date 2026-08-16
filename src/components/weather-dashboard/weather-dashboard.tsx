import { Logo } from "@/components/logo"
import { UnitsConverter } from "@/components/units-converter/units-converter"
import { CurrentConditions } from "@/components/weather-dashboard/current-conditions"
import { CurrentWeatherCard } from "@/components/weather-dashboard/current-weather-card"
import { DailyForecast } from "@/components/weather-dashboard/daily-forecast/daily-forecast"
import { DashboardStateNotice } from "@/components/weather-dashboard/dashboard-state-notice"
import { ForecastErrorState } from "@/components/weather-dashboard/forecast-error-state"
import { HourlyForecast } from "@/components/weather-dashboard/hourly-forecast/hourly-forecast"
import { SearchHero } from "@/components/weather-dashboard/search-hero"
import { useWeatherDashboard } from "@/hooks/use-weather-dashboard"

/**
 * Page-level layout. All data and derivation live in `useWeatherDashboard`, so
 * this component only decides which regions to render.
 */
export function WeatherDashboard() {
  const {
    currentWeather,
    forecast,
    isFullPageError,
    isLoading,
    isRetrying,
    metrics,
    notice,
    onRetry,
    onSelectLocation,
    unitControls,
  } = useWeatherDashboard()

  return (
    <main className="min-h-screen px-4 py-4 text-left sm:px-8 sm:py-6">
      <div className="mx-auto flex w-full max-w-304 flex-col gap-8 lg:gap-10">
        <header className="flex items-center justify-between gap-4">
          <Logo />
          <UnitsConverter {...unitControls} />
        </header>

        {isFullPageError
          ? (
              <ForecastErrorState
                isRetrying={isRetrying}
                onRetry={onRetry}
              />
            )
          : (
              <>
                <SearchHero onSelectLocation={onSelectLocation} />

                {notice && <DashboardStateNotice notice={notice} />}

                <section className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(22rem,1fr)]">
                  <div className="flex flex-col gap-8">
                    <CurrentWeatherCard
                      {...currentWeather}
                      isLoading={isLoading}
                    />

                    <CurrentConditions
                      isLoading={isLoading}
                      metrics={metrics}
                    />

                    <DailyForecast
                      forecast={forecast}
                      isLoading={isLoading}
                    />
                  </div>

                  <HourlyForecast
                    forecast={forecast}
                    isLoading={isLoading}
                  />
                </section>
              </>
            )}
      </div>
    </main>
  )
}
