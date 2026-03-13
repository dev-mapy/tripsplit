"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { fetchTripCount } from "./api";

interface TripLimitContextValue {
  count: number;
  limit: number;
  remaining: number;
  loading: boolean;
  refresh: () => Promise<void>;
  isFull: boolean;
}

const TripLimitContext = createContext<TripLimitContextValue | null>(null);

export function TripLimitProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState({ count: 0, limit: 3, remaining: 3 });
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const result = await fetchTripCount();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch trip count:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refresh();
    } else {
      setData({ count: 0, limit: 3, remaining: 3 });
    }
  }, [user, refresh]);

  return (
    <TripLimitContext.Provider
      value={{
        ...data,
        loading,
        refresh,
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
