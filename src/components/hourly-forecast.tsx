"use client"
import type { SuccessfulApiResponse } from "@/types/api-response"
import { parseAsString, useQueryState } from "nuqs"
import { useMemo } from "react"
import iconDropdown from "@/assets/images/icon-dropdown.svg"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import {
  formatForecastDayOption,
  formatForecastHour,
  formatTemperature,
  getWeatherSummary,
} from "@/lib/weather"

type HourlyForecastProps = {
  forecast?: SuccessfulApiResponse
  isLoading?: boolean
}

type HourlyForecastRow = {
  dateKey: string
  time: string
  temperature: number
  weatherCode: number
}

type HourlyDayOption = {
  dateKey: string
  label: string
}

const loadingRowKeys = Array.from({ length: 8 }, (_, index) => index)

export function HourlyForecast({ forecast, isLoading }: HourlyForecastProps) {
  const [selectedDate, setSelectedDate] = useQueryState(
    "day",
    parseAsString.withOptions({
      clearOnDefault: false,
      history: "replace",
      shallow: true,
    }),
  )
  const hourlyRows = useMemo(() => getHourlyForecastRows(forecast), [forecast])
  const dayOptions = useMemo(
    () => getHourlyDayOptions(forecast),
    [forecast],
  )
  const selectedDateKey = dayOptions.find(
    day => day.dateKey === selectedDate,
  )?.dateKey ?? dayOptions[0]?.dateKey
  const selectedDayLabel = dayOptions.find(
    day => day.dateKey === selectedDateKey,
  )?.label ?? "Today"
  const triggerLabel = dayOptions.length ? selectedDayLabel : "-"
  const triggerAriaLabel = dayOptions.length
    ? `Select hourly forecast day, ${selectedDayLabel} selected`
    : "Hourly forecast day unavailable"
  const listLabel = dayOptions.length
    ? `${selectedDayLabel} hourly forecast`
    : "Hourly forecast"
  const visibleRows = hourlyRows
    .filter(row => row.dateKey === selectedDateKey)
  const unit = forecast?.hourly_units.temperature_2m ?? "°C"

  return (
    <Card
      className="rounded-lg border-0 bg-card py-4 sm:py-6"
      aria-labelledby="hourly-forecast-heading"
    >
      <CardHeader className="flex items-center justify-between gap-4 px-4 sm:px-6">
        <CardTitle id="hourly-forecast-heading" className="text-lg sm:text-xl">
          Hourly Forecast
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="sm"
              className="h-9 rounded-lg px-3 text-sm focus-visible:ring-2 focus-visible:ring-neutral-0 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:bg-neutral-600 sm:h-10 sm:text-base"
              disabled={!dayOptions.length}
              aria-label={triggerAriaLabel}
            >
              {triggerLabel}
              <img src={iconDropdown} alt="" className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[13.5rem] rounded-lg border-border bg-popover p-2 shadow-xl">
            <DropdownMenuRadioGroup
              value={selectedDateKey}
              onValueChange={(dateKey) => {
                void setSelectedDate(dateKey)
              }}
            >
              {dayOptions.map(day => (
                <DropdownMenuRadioItem
                  key={day.dateKey}
                  textValue={day.label}
                  value={day.dateKey}
                  className="min-h-10 cursor-pointer rounded-lg text-base focus:bg-secondary focus:text-foreground data-[highlighted]:bg-secondary data-[highlighted]:text-foreground data-[state=checked]:bg-secondary"
                >
                  {day.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div
          className="flex max-h-[37rem] flex-col gap-3 overflow-y-auto pr-1"
          role="list"
          aria-label={listLabel}
        >
          {isLoading && (
            <p
              className="sr-only"
              role="status"
              aria-live="polite"
            >
              Loading hourly forecast...
            </p>
          )}

          {isLoading && loadingRowKeys.map(key => (
            <HourlyForecastRowSkeleton key={key} />
          ))}

          {!isLoading && visibleRows.map((row) => {
            const weather = getWeatherSummary(row.weatherCode)

            return (
              <div
                key={row.time}
                className="grid min-h-[3.25rem] grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3 transition-colors hover:border-neutral-300/50 hover:bg-neutral-600 sm:min-h-[3.875rem]"
                role="listitem"
              >
                <img
                  src={weather.icon}
                  alt={weather.description}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-sm font-medium">
                  {formatForecastHour(row.time)}
                </span>
                <span className="text-sm font-semibold">
                  {formatTemperature(row.temperature, unit)}
                </span>
              </div>
            )
          })}

          {!isLoading && !visibleRows.length && (
            <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
              Hourly forecast unavailable.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function HourlyForecastRowSkeleton() {
  return (
    <div className="grid min-h-[3.25rem] grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3 sm:min-h-[3.875rem]">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-5 w-10" />
    </div>
  )
}

function getHourlyForecastRows(
  forecast: SuccessfulApiResponse | undefined,
): HourlyForecastRow[] {
  if (!forecast) {
    return []
  }

  return forecast.hourly.time.reduce<HourlyForecastRow[]>(
    (rows, time, index) => {
      const temperature = forecast.hourly.temperature_2m[index]
      const weatherCode = forecast.hourly.weather_code[index]

      if (temperature === undefined || weatherCode === undefined) {
        return rows
      }

      rows.push({
        dateKey: time.slice(0, 10),
        time,
        temperature,
        weatherCode,
      })

      return rows
    },
    [],
  )
}

function getHourlyDayOptions(
  forecast: SuccessfulApiResponse | undefined,
): HourlyDayOption[] {
  if (!forecast) {
    return []
  }

  return forecast.daily.time.slice(0, 7).map(dateKey => ({
    dateKey,
    label: formatForecastDayOption(dateKey),
  }))
}
