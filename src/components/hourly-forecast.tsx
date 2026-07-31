"use client"
import type { SuccessfulApiResponse } from "@/types/api-response"
import { useMemo, useState } from "react"
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
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  formatForecastDay,
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
  hour: string
  temperature: number
  weatherCode: number
}

export function HourlyForecast({ forecast, isLoading }: HourlyForecastProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const hourlyRows = useMemo(() => getHourlyForecastRows(forecast), [forecast])
  const dayOptions = useMemo(
    () => getHourlyDayOptions(hourlyRows),
    [hourlyRows],
  )
  const selectedDateKey = dayOptions.some(day => day.dateKey === selectedDate)
    ? selectedDate
    : dayOptions[0]?.dateKey
  const selectedDayLabel = dayOptions.find(
    day => day.dateKey === selectedDateKey,
  )?.label ?? "Today"
  const visibleRows = hourlyRows
    .filter(row => row.dateKey === selectedDateKey)
    .slice(0, 8)

  const unit = forecast?.hourly_units.temperature_2m ?? "°C"

  return (
    <Card className="rounded-lg border-0 bg-card">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Hourly Forecast</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" disabled={!dayOptions.length}>
              {selectedDayLabel}
              <img src={iconDropdown} alt="Filter" className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {dayOptions.map(day => (
              <DropdownMenuCheckboxItem
                key={day.dateKey}
                checked={day.dateKey === selectedDateKey}
                onCheckedChange={() => setSelectedDate(day.dateKey)}
              >
                {day.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex max-h-[37rem] flex-col gap-3 overflow-y-auto pr-1">
          {isLoading && (
            <p className="rounded-lg bg-secondary px-4 py-3 text-sm text-muted-foreground">
              Loading hourly forecast...
            </p>
          )}

          {!isLoading && visibleRows.map((row) => {
            const weather = getWeatherSummary(row.weatherCode)

            return (
              <div
                key={`${row.dateKey}-${row.hour}`}
                className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 rounded-lg border border-border bg-secondary px-4 py-3"
              >
                <img
                  src={weather.icon}
                  alt={weather.description}
                  className="h-8 w-8 object-contain"
                />
                <span className="text-sm font-medium">{row.hour}</span>
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
        hour: formatForecastHour(time),
        temperature,
        weatherCode,
      })

      return rows
    },
    [],
  )
}

function getHourlyDayOptions(rows: HourlyForecastRow[]) {
  return Array.from(new Set(rows.map(row => row.dateKey))).map(dateKey => ({
    dateKey,
    label: formatForecastDay(dateKey),
  }))
}
