import drizzleIcon from "@/assets/images/icon-drizzle.webp"
import fogIcon from "@/assets/images/icon-fog.webp"
import overcastIcon from "@/assets/images/icon-overcast.webp"
import partlyCloudyIcon from "@/assets/images/icon-partly-cloudy.webp"
import rainIcon from "@/assets/images/icon-rain.webp"
import snowIcon from "@/assets/images/icon-snow.webp"
import stormIcon from "@/assets/images/icon-storm.webp"
import sunnyIcon from "@/assets/images/icon-sunny.webp"

type WeatherSummary = {
  description: string
  icon: string
}

/** Used until the API reports the unit it actually returned readings in. */
export const DEFAULT_TEMPERATURE_UNIT = "°C"

const weatherIconGroups = [
  {
    codes: [0],
    description: "Clear sky",
    icon: sunnyIcon,
  },
  {
    codes: [1, 2],
    description: "Partly cloudy",
    icon: partlyCloudyIcon,
  },
  {
    codes: [3],
    description: "Overcast",
    icon: overcastIcon,
  },
  {
    codes: [45, 48],
    description: "Fog",
    icon: fogIcon,
  },
  {
    codes: [51, 53, 55, 56, 57],
    description: "Drizzle",
    icon: drizzleIcon,
  },
  {
    codes: [61, 63, 65, 66, 67, 80, 81, 82],
    description: "Rain",
    icon: rainIcon,
  },
  {
    codes: [71, 73, 75, 77, 85, 86],
    description: "Snow",
    icon: snowIcon,
  },
  {
    codes: [95, 96, 99],
    description: "Thunderstorm",
    icon: stormIcon,
  },
] satisfies Array<WeatherSummary & { codes: number[] }>

export function getWeatherSummary(weatherCode: number): WeatherSummary {
  return (
    weatherIconGroups.find(group => group.codes.includes(weatherCode))
    ?? {
      description: "Overcast",
      icon: overcastIcon,
    }
  )
}

export function formatTemperature(value: number, unit: string) {
  const rounded = Math.round(value)

  if (unit === "°C" || unit === "°F") {
    return `${rounded}°`
  }

  return `${rounded} ${unit}`
}

export function formatMeasurement(value: number, unit: string) {
  const label = unit === "inch" ? "in" : unit
  const rounded = unit === "inch"
    ? Math.round(value * 100) / 100
    : Math.round(value)

  if (unit === "%") {
    return `${rounded}%`
  }

  return `${rounded} ${label}`
}

export function formatForecastDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
  }).format(parseOpenMeteoLocalTime(value))
}

export function formatForecastDay(value: string) {
  return new Intl.DateTimeFormat("en", {
    timeZone: "UTC",
    weekday: "long",
  }).format(parseOpenMeteoLocalTime(value))
}

export function formatForecastDayOption(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
    weekday: "short",
  }).format(parseOpenMeteoLocalTime(value))
}

export function formatForecastShortDay(value: string) {
  return new Intl.DateTimeFormat("en", {
    timeZone: "UTC",
    weekday: "short",
  }).format(parseOpenMeteoLocalTime(value))
}

export function formatForecastHour(value: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    timeZone: "UTC",
  }).format(parseOpenMeteoLocalTime(value))
}

function parseOpenMeteoLocalTime(value: string) {
  const [date = "", time = "00:00"] = value.split("T")
  const [year = "0", month = "1", day = "1"] = date.split("-")
  const [hour = "0", minute = "0"] = time.split(":")

  return new Date(Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
  ))
}
