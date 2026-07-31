import { useQuery } from "@tanstack/react-query"
import { queryKeys } from "@/constants/query-keys"

type BrowserCoordinates = {
  latitude: number
  longitude: number
}

type UseGeolocationOptions = {
  enabled?: boolean
}

export function useGeolocation({ enabled = true }: UseGeolocationOptions = {}) {
  return useQuery<BrowserCoordinates, Error>({
    queryKey: queryKeys.geolocation,
    queryFn: () => {
      if (!navigator.geolocation) {
        throw new Error("Browser geolocation is unavailable")
      }

      return new Promise<BrowserCoordinates>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          position =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          error => reject(error),
        )
      })
    },
    enabled,
    retry: false,
    staleTime: Infinity,
  })
}
