import type { Trip } from "@/types";
import { CURRENCIES } from "@/lib/constants";
import { DEFAULT_CURRENCY } from "@/lib/constants";

/**
 * Encode trip state to a base64 URL-safe string.
 * We compress the keys to keep the URL short.
 */
export function encodeTrip(trip: Trip): string {
  const compressed = {
    n: trip.name,
    c: trip.currency.code,
    t: trip.travelers.map((t) => ({ i: t.id, n: t.name })),
    e: trip.expenses.map((e) => ({
      i: e.id,
      d: e.desc,
      a: e.amount,
      c: e.category,
      p: e.paidBy,
      s: e.splitAmong,
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

    return {
      name: compressed.n ?? "",
      currency,
      travelers: (compressed.t ?? []).map((t: { i: string; n: string }) => ({
        id: t.i,
        name: t.n,
      })),
      expenses: (compressed.e ?? []).map(
        (e: {
          i: string;
          d: string;
          a: number;
          c: string;
          p: string;
          s: string[];
        }) => ({
          id: e.i,
          desc: e.d,
          amount: e.a,
          category: e.c,
          paidBy: e.p,
          splitAmong: e.s,
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
