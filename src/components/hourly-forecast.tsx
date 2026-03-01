import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import iconDropdown from "@/assets/images/icon-dropdown.svg";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useFetchWeatherForecast } from "@/hooks/use-weather-forecast";

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function HourlyForecast() {
  const { data } = useFetchWeatherForecast({
    latitude: 52.52,
    longitude: 13.41,
    hourly: "temperature_2m",
  });

  const [selectedDay, setSelectedDay] = useState<string>(daysOfWeek[0]);

  const unit = data?.hourly_units.temperature_2m ?? "°C";

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Hourly Forecast</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              {selectedDay}
              <img src={iconDropdown} alt="Filter" className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            {daysOfWeek.map((day) => (
              <DropdownMenuCheckboxItem
                key={day}
                checked={day === selectedDay}
                onCheckedChange={() => setSelectedDay(day)}
              >
                {day}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 overflow-y-auto max-h-120 pr-1">
          {data?.hourly.time.map((time, i) => {
            const date = new Date(time);
            if (format(date, "EEE") !== selectedDay) return null;
            return (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3"
              >
                <span className="text-sm text-muted-foreground">{format(date, "h a")}</span>
                <span className="font-medium">{Math.round(data.hourly.temperature_2m[i])}{unit}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
