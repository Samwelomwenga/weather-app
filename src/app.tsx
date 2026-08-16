import { AppProviders } from "@/components/app-providers"
import { WeatherDashboard } from "@/components/weather-dashboard/weather-dashboard"

export default function App() {
  return (
    <AppProviders>
      <WeatherDashboard />
    </AppProviders>
  )
}
