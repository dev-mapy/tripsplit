import { describe, it, expect } from "vitest";
import { calcSettlement } from "./calculator";
import type { Traveler, Expense } from "@/types";

const travelers: Traveler[] = [
  { id: "a", name: "Ana" },
  { id: "b", name: "Bob" },
  { id: "c", name: "Carlos" },
];

describe("calcSettlement", () => {
  it("returns zero balances when no expenses", () => {
    const result = calcSettlement(travelers, []);
    expect(result.balances).toEqual({ a: 0, b: 0, c: 0 });
    expect(result.transactions).toHaveLength(0);
  });

  it("splits evenly among all travelers", () => {
    const expenses: Expense[] = [{
      id: "1", desc: "Dinner", amount: 90, category: "Food",
      paidBy: "a", splitAmong: ["a", "b", "c"],
    }];
    const { balances } = calcSettlement(travelers, expenses);
    expect(balances["a"]).toBeCloseTo(60);
    expect(balances["b"]).toBeCloseTo(-30);
    expect(balances["c"]).toBeCloseTo(-30);
  });

  it("minimizes number of transactions", () => {
    const expenses: Expense[] = [
      { id: "1", desc: "Hotel", amount: 300, category: "Hotel",
        paidBy: "a", splitAmong: ["a", "b", "c"] },
      { id: "2", desc: "Food", amount: 60, category: "Food",
        paidBy: "b", splitAmong: ["a", "b", "c"] },
    ];
    const { transactions } = calcSettlement(travelers, expenses);
    expect(transactions.length).toBeLessThanOrEqual(2);
  });

  it("handles already-settled trips", () => {
    const expenses: Expense[] = [
      { id: "1", desc: "Lunch", amount: 30, category: "Food",
        paidBy: "a", splitAmong: ["a", "b", "c"] },
      { id: "2", desc: "Drinks", amount: 30, category: "Food",
        paidBy: "b", splitAmong: ["a", "b", "c"] },
      { id: "3", desc: "Taxi", amount: 30, category: "Transport",
        paidBy: "c", splitAmong: ["a", "b", "c"] },
    ];
    const { transactions } = calcSettlement(travelers, expenses);
    expect(transactions).toHaveLength(0);
  });

  it("rounds amounts to 2 decimal places", () => {
    const expenses: Expense[] = [{
      id: "1", desc: "Odd split", amount: 10, category: "Food",
      paidBy: "a", splitAmong: ["a", "b", "c"],
    }];
    const { transactions } = calcSettlement(travelers, expenses);
    transactions.forEach((tx) => {
      expect(tx.amount).toBe(Math.round(tx.amount * 100) / 100);
    });
  });
});
