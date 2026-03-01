import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/constants/query-keys";

export function useGeolocation() {
  return useQuery<{ latitude: number; longitude: number }, Error>({
    queryKey: queryKeys.geolocation,
    queryFn: () =>
      new Promise<{ latitude: number; longitude: number }>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) =>
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            }),
          (error) => reject(error),
        );
      }),
    staleTime: Infinity,
  });
}
