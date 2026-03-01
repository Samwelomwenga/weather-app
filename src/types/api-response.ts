export type SuccessfulApiResponse = {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    hourly_units: {
        time: string;
        temperature_2m: string;
    };
    hourly: {
        time: string[];
        temperature_2m: number[];
    };
}
export type ErrorApiResponse = {
    error: boolean;
    reason: string;
}

export type ApiResponse = SuccessfulApiResponse | ErrorApiResponse;