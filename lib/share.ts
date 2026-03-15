import type { Trip, Traveler } from "@/types";
import { CURRENCIES, CATEGORIES } from "@/lib/constants";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import { randomId } from "@/lib/utils";

/**
 * Encode trip state to a base64 URL-safe string.
 * We compress the keys and values to keep the URL as short as possible.
 */
export function encodeTrip(trip: Trip): string {
  // Map traveler IDs to their index for shorter storage
  const travelerIdToIndex = new Map(trip.travelers.map((t, i) => [t.id, i]));

  const compressed = {
    n: trip.name,
    c: trip.currency.code,
    o: trip.ownerName,
    ie: trip.isEditable ? 1 : 0,
    t: trip.travelers.map((t) => t.name),
    e: trip.expenses.map((e) => ({
      d: e.desc,
      a: e.amount,
      c: CATEGORIES.indexOf(e.category),
      p: travelerIdToIndex.get(e.paidBy) ?? 0,
      s: e.splitAmong.map((id) => travelerIdToIndex.get(id) ?? 0),
    })),
  };

  const json = JSON.stringify(compressed);
  // btoa requires ASCII — use encodeURIComponent to handle unicode trip names
  return btoa(encodeURIComponent(json));
}

/**
 * Decode a base64 URL-safe string back to trip state.
 * Returns null if the string is invalid or corrupted.
 */
export function decodeTrip(encoded: string): Trip | null {
  try {
    const json = decodeURIComponent(atob(encoded));
    const compressed = JSON.parse(json);

    const currency =
      CURRENCIES.find((c) => c.code === compressed.c) ?? DEFAULT_CURRENCY;

    // Re-generate stable random IDs for travelers
    const travelers: Traveler[] = (compressed.t ?? []).map((name: string) => ({
      id: randomId(),
      name,
    }));

    return {
      name: compressed.n ?? "",
      currency,
      ownerName: compressed.o,
      isEditable: compressed.ie === 1,
      travelers,
      expenses: (compressed.e ?? []).map(
        (e: {
          d: string;
          a: number;
          c: number;
          p: number;
          s: number[];
        }) => ({
          id: randomId(),
          desc: e.d,
          amount: e.a,
          category: CATEGORIES[e.c] ?? CATEGORIES[0],
          paidBy: travelers[e.p]?.id ?? travelers[0]?.id,
          splitAmong: e.s.map((idx) => travelers[idx]?.id).filter(Boolean),
        })
      ),
    };
  } catch {
    return null;
  }
}

/**
 * Generate the full shareable URL for a trip.
 */
export function buildShareUrl(encoded: string): string {
  if (typeof window === "undefined") return "";
  const url = new URL(window.location.href);
  url.search = "";
  url.searchParams.set("trip", encoded);
  return url.toString();
}
