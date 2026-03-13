"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useQueryState } from "nuqs";
import { useAuth } from "@/lib/auth-context";
import type { Trip, Traveler, Expense, Currency } from "@/types";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { randomId } from "@/lib/utils";
import { encodeTrip, decodeTrip } from "@/lib/share";

type Step = "setup" | "expenses" | "result";

interface TripContextValue {
  trip: Trip;
  step: Step;
  setStep: (step: Step) => void;
  updateTripName: (name: string) => void;
  updateCurrency: (currency: Currency) => void;
  addTraveler: (name: string) => void;
  removeTraveler: (id: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  resetTrip: () => void;
  shareUrl: string;
  isSharedView: boolean;
  isReadOnly: boolean;
}

const makeDefaultTrip = (): Trip => ({
  name: "",
  currency: DEFAULT_CURRENCY,
  travelers: [
    { id: randomId(), name: "You" },
    { id: randomId(), name: "Alex" },
  ],
  expenses: [],
});

export const TripContext = createContext<TripContextValue | null>(null);

interface TripProviderProps {
  children: ReactNode;
  initialTrip?: Partial<Trip>;
  isReadOnly?: boolean;
}

export function TripProvider({
  children,
  initialTrip,
  isReadOnly = false,
}: TripProviderProps) {
  const { user } = useAuth();
  const [encodedTrip, setEncodedTrip] = useQueryState("trip", {
    defaultValue: "",
    shallow: false,
  });

  // On first load: if a ?trip= param exists, decode it. Otherwise use defaults.
  const [trip, setTrip] = useState<Trip>(() => {
    if (initialTrip) {
      return { ...makeDefaultTrip(), ...initialTrip };
    }
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const param = params.get("trip");
      if (param) {
        const decoded = decodeTrip(param);
        if (decoded) return decoded;
      }
    }
    return makeDefaultTrip();
  });

  // Determine if this is a shared view (opened via a link)
  const isSharedView = encodedTrip.length > 0;

  // Determine the step: if loaded from a shared link, go straight to result
  const [step, setStep] = useState<Step>(() =>
    isSharedView ? "result" : "setup"
  );

  // Keep the URL in sync whenever trip state changes
  const syncUrl = useCallback(
    (updatedTrip: Trip) => {
      const encoded = encodeTrip(updatedTrip);
      setEncodedTrip(encoded);
    },
    [setEncodedTrip]
  );

  // Generate the current shareable URL
  const [shareUrl, setShareUrl] = useState("");
  useEffect(() => {
    if (encodedTrip) {
      const url = new URL(window.location.href);
      url.searchParams.set("trip", encodedTrip);
      setShareUrl(url.toString());
    }
  }, [encodedTrip]);

  // Sync URL when trip changes (only for anonymous users)
  useEffect(() => {
    if (initialTrip) return;
    if (trip.name || trip.expenses.length > 0) {
      syncUrl(trip);
    }
  }, [trip, syncUrl, initialTrip]);

  const updateTripName = useCallback((name: string) => {
    setTrip((t) => ({ ...t, name }));
  }, []);

  const updateCurrency = useCallback((currency: Currency) => {
    setTrip((t) => ({ ...t, currency }));
  }, []);

  const addTraveler = useCallback((name: string) => {
    const traveler: Traveler = { id: randomId(), name: name.trim() };
    setTrip((t) => ({ ...t, travelers: [...t.travelers, traveler] }));
  }, []);

  const removeTraveler = useCallback((id: string) => {
    setTrip((t) => ({
      ...t,
      travelers: t.travelers.filter((tr) => tr.id !== id),
      expenses: t.expenses.filter((e) => e.paidBy !== id),
    }));
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setTrip((t) => ({
      ...t,
      expenses: [...t.expenses, { ...expense, id: randomId() }],
    }));
  }, []);

  const updateExpense = useCallback(
    (id: string, expense: Omit<Expense, "id">) => {
      setTrip((t) => ({
        ...t,
        expenses: t.expenses.map((e) =>
          e.id === id ? { ...expense, id } : e
        ),
      }));
    },
    []
  );

  const deleteExpense = useCallback((id: string) => {
    setTrip((t) => ({
      ...t,
      expenses: t.expenses.filter((e) => e.id !== id),
    }));
  }, []);

  const resetTrip = useCallback(() => {
    const fresh = makeDefaultTrip();
    setTrip(fresh);
    setEncodedTrip("");
    setStep("setup");
  }, [setEncodedTrip]);

  return (
    <TripContext.Provider
      value={{
        trip,
        step,
        setStep,
        updateTripName,
        updateCurrency,
        addTraveler,
        removeTraveler,
        addExpense,
        updateExpense,
        deleteExpense,
        resetTrip,
        shareUrl,
        isSharedView,
        isReadOnly,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside TripProvider");
  return ctx;
}
