import { describe, it, expect } from "vitest";
import { encodeTrip, decodeTrip } from "./share";
import type { Trip } from "@/types";

const mockTrip: Trip = {
  name: "Bali 2026",
  currency: { code: "USD", symbol: "$", flag: "🇺🇸" },
  travelers: [
    { id: "abc123", name: "Ana" },
    { id: "def456", name: "Bob" },
  ],
  expenses: [
    {
      id: "exp001",
      desc: "Beach Dinner",
      amount: 90,
      category: "🍽️ Food",
      paidBy: "abc123",
      splitAmong: ["abc123", "def456"],
    },
  ],
};

describe("encodeTrip / decodeTrip", () => {
  it("round-trips a full trip correctly", () => {
    const encoded = encodeTrip(mockTrip);
    const decoded = decodeTrip(encoded);

    expect(decoded).not.toBeNull();
    expect(decoded?.name).toBe("Bali 2026");
    expect(decoded?.currency.code).toBe("USD");
    expect(decoded?.travelers).toHaveLength(2);
    expect(decoded?.travelers[0].name).toBe("Ana");
    expect(decoded?.expenses).toHaveLength(1);
    expect(decoded?.expenses[0].desc).toBe("Beach Dinner");
    expect(decoded?.expenses[0].amount).toBe(90);
  });

  it("handles trip names with unicode/emoji", () => {
    const trip = { ...mockTrip, name: "Tōkyō Trip 🗼" };
    const encoded = encodeTrip(trip);
    const decoded = decodeTrip(encoded);
    expect(decoded?.name).toBe("Tōkyō Trip 🗼");
  });

  it("returns null for corrupted input", () => {
    expect(decodeTrip("not-valid-base64!!!")).toBeNull();
    expect(decodeTrip("")).toBeNull();
    expect(decodeTrip("aGVsbG8=")).toBeNull(); // valid base64 but not trip JSON
  });

  it("preserves relative traveler relationships in expenses", () => {
    const encoded = encodeTrip(mockTrip);
    const decoded = decodeTrip(encoded);
    const exp = decoded?.expenses[0];
    const travelers = decoded?.travelers ?? [];

    expect(exp?.paidBy).toBe(travelers[0].id);
    expect(exp?.splitAmong).toEqual([travelers[0].id, travelers[1].id]);
  });

  it("handles empty expenses array", () => {
    const trip = { ...mockTrip, expenses: [] };
    const encoded = encodeTrip(trip);
    const decoded = decodeTrip(encoded);
    expect(decoded?.expenses).toHaveLength(0);
  });
});
