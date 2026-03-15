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
  updateOwnerName: (name: string) => void;
  updateIsEditable: (isEditable: boolean) => void;
  updateCurrency: (currency: Currency) => void;
  addTraveler: (name: string, includeInExpenseIds?: string[]) => void;
  removeTraveler: (id: string) => void;
  addExpense: (expense: Omit<Expense, "id">) => void;
  updateExpense: (id: string, expense: Omit<Expense, "id">) => void;
  deleteExpense: (id: string) => void;
  makeItOwn: (name: string, includeInExpenseIds?: string[]) => void;
  resetTrip: () => void;
  shareUrl: string;
  isSharedView: boolean;
  isReadOnly: boolean;
  hasBeenModified: boolean;
}

const makeDefaultTrip = (): Trip => ({
  name: "",
  ownerName: "",
  isEditable: false,
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
  isReadOnly: isReadOnlyProp = false,
}: TripProviderProps) {
  const { user } = useAuth();
  const [encodedTrip, setEncodedTrip] = useQueryState("trip", {
    defaultValue: "",
    shallow: false,
  });

  const [hasBeenModified, setHasBeenModified] = useState(() => {
    if (typeof window === "undefined") return true;
    const params = new URLSearchParams(window.location.search);
    return !params.has("trip");
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

  const isReadOnly = isReadOnlyProp || (isSharedView && !hasBeenModified && trip.isEditable === false);

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
    setHasBeenModified(true);
  }, []);

  const updateOwnerName = useCallback((name: string) => {
    setTrip((t) => {
      const newTravelers = [...t.travelers];
      if (newTravelers.length > 0) {
        newTravelers[0] = { ...newTravelers[0], name };
      }
      return { ...t, ownerName: name, travelers: newTravelers };
    });
    setHasBeenModified(true);
  }, []);

  const updateIsEditable = useCallback((isEditable: boolean) => {
    setTrip((t) => ({ ...t, isEditable }));
    setHasBeenModified(true);
  }, []);

  const updateCurrency = useCallback((currency: Currency) => {
    setTrip((t) => ({ ...t, currency }));
    setHasBeenModified(true);
  }, []);

  const addTraveler = useCallback((name: string, includeInExpenseIds?: string[]) => {
    const traveler: Traveler = { id: randomId(), name: name.trim() };
    setTrip((t) => {
      const newExpenses = t.expenses.map((e) => {
        if (includeInExpenseIds?.includes(e.id)) {
          return { ...e, splitAmong: [...e.splitAmong, traveler.id] };
        }
        return e;
      });
      return {
        ...t,
        travelers: [...t.travelers, traveler],
        expenses: newExpenses,
      };
    });
    setHasBeenModified(true);
  }, []);

  const removeTraveler = useCallback((id: string) => {
    setTrip((t) => ({
      ...t,
      travelers: t.travelers.filter((tr) => tr.id !== id),
      expenses: t.expenses.filter((e) => e.paidBy !== id),
    }));
    setHasBeenModified(true);
  }, []);

  const addExpense = useCallback((expense: Omit<Expense, "id">) => {
    setTrip((t) => ({
      ...t,
      expenses: [...t.expenses, { ...expense, id: randomId() }],
    }));
    setHasBeenModified(true);
  }, []);

  const updateExpense = useCallback(
    (id: string, expense: Omit<Expense, "id">) => {
      setTrip((t) => ({
        ...t,
        expenses: t.expenses.map((e) =>
          e.id === id ? { ...expense, id } : e
        ),
      }));
      setHasBeenModified(true);
    },
    []
  );

  const deleteExpense = useCallback((id: string) => {
    setTrip((t) => ({
      ...t,
      expenses: t.expenses.filter((e) => e.id !== id),
    }));
    setHasBeenModified(true);
  }, []);

  const makeItOwn = useCallback((name: string, includeInExpenseIds?: string[]) => {
    setTrip((t) => {
      const trimmed = name.trim();
      const existingIdx = t.travelers.findIndex(
        (tr) => tr.name.toLowerCase() === trimmed.toLowerCase()
      );

      let newTravelers: Traveler[];
      let newTravelerId: string;

      if (existingIdx !== -1) {
        // Move existing traveler to index 0
        const found = t.travelers[existingIdx];
        newTravelerId = found.id;
        const others = t.travelers.filter((_, idx) => idx !== existingIdx);
        newTravelers = [found, ...others];
      } else {
        // Add as new traveler at index 0
        newTravelerId = randomId();
        newTravelers = [{ id: newTravelerId, name: trimmed }, ...t.travelers];
      }

      // Apply expense logic
      const newExpenses = t.expenses.map((e) => {
        if (includeInExpenseIds?.includes(e.id)) {
          // Add to splitAmong if not already there
          if (!e.splitAmong.includes(newTravelerId)) {
            return { ...e, splitAmong: [...e.splitAmong, newTravelerId] };
          }
        }
        return e;
      });

      return {
        ...t,
        ownerName: trimmed,
        isEditable: true,
        travelers: newTravelers,
        expenses: newExpenses,
      };
    });
    setHasBeenModified(true);
  }, []);

  const resetTrip = useCallback(() => {
    const fresh = makeDefaultTrip();
    setTrip(fresh);
    setEncodedTrip("");
    setHasBeenModified(true);
    setStep("setup");
  }, [setEncodedTrip]);

  return (
    <TripContext.Provider
      value={{
        trip,
        step,
        setStep,
        updateTripName,
        updateOwnerName,
        updateIsEditable,
        updateCurrency,
        addTraveler,
        removeTraveler,
        addExpense,
        updateExpense,
        deleteExpense,
        makeItOwn,
        resetTrip,
        shareUrl,
        isSharedView,
        isReadOnly,
        hasBeenModified,
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
