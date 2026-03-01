import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";
import type { ApiResponse, SuccessfulApiResponse, ErrorApiResponse } from "@/types/api-response";

export type FetchWeatherForecastQueryParams = {
  latitude: number;
  longitude: number;
  hourly?: string;
daily?: string;
temperature_unit?: "celsius" | "fahrenheit";
wind_speed_unit?: "kmh" | "ms" | "mph" | "kn";
precipitation_unit?: "mm" | "inch";
timeformat?: string;
timezone?: string;
forecast_days?: number;
forecast_hours?: number;

};

export function useFetchWeatherForecast() {
    const params = {
	latitude: 52.52,
	longitude: 13.41,
	hourly: "temperature_2m",
};
    return useQuery<SuccessfulApiResponse, Error>(
        {
        queryKey: queryKeys.forecast,
        queryFn: async () => {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&hourly=${params.hourly}`);
            const data = await response.json() as ApiResponse;
            if (!response.ok) {
                throw new Error((data as ErrorApiResponse).reason || "Failed to fetch weather forecast");
            }
            return data as SuccessfulApiResponse;
        },
        
        }
    );
}