import useSWR from "swr";
import type { SavedTrip } from "@/types";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    const info = await res.json();
    (error as any).status = res.status;
    (error as any).info = info;
    throw error;
  }
  return res.json();
};

export function useUserTrips() {
  const { data, error, isLoading, mutate } = useSWR<{ trips: SavedTrip[] }>(
    "/api/trips",
    fetcher
  );

  return {
    trips: data?.trips ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}

export function useTrip(slug: string | null) {
  const { data, error, isLoading, mutate } = useSWR<SavedTrip>(
    slug ? `/api/trips/${slug}` : null,
    fetcher
  );

  return {
    trip: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useTripCount() {
  const { data, error, isLoading, mutate } = useSWR<{
    count: number;
    limit: number;
    remaining: number;
  }>("/api/trips/count", fetcher);

  return {
    tripCount: data,
    isLoading,
    isError: error,
    mutate,
  };
}
