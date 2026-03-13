"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { useTripCount } from "./swr";

interface TripLimitContextValue {
  count: number;
  limit: number;
  remaining: number;
  loading: boolean;
  refresh: () => void;
  isFull: boolean;
}

const TripLimitContext = createContext<TripLimitContextValue | null>(null);

export function TripLimitProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { tripCount, isLoading, mutate } = useTripCount();

  const data = useMemo(() => {
    if (!user) return { count: 0, limit: 3, remaining: 3 };
    return tripCount ?? { count: 0, limit: 3, remaining: 3 };
  }, [user, tripCount]);

  return (
    <TripLimitContext.Provider
      value={{
        ...data,
        loading: isLoading,
        refresh: () => mutate(),
        isFull: data.count >= data.limit,
      }}
    >
      {children}
    </TripLimitContext.Provider>
  );
}

export function useTripLimit() {
  const ctx = useContext(TripLimitContext);
  if (!ctx) throw new Error("useTripLimit must be used inside TripLimitProvider");
  return ctx;
}
