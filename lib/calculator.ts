import type { Expense, Traveler, Settlement } from "@/types";

export function calcSettlement(
  travelers: Traveler[],
  expenses: Expense[]
): Settlement {
  const balances: Record<string, number> = {};
  travelers.forEach((t) => (balances[t.id] = 0));

  expenses.forEach((exp) => {
    const share = exp.amount / exp.splitAmong.length;
    balances[exp.paidBy] += exp.amount;
    exp.splitAmong.forEach((id) => (balances[id] -= share));
  });

  const creditors = Object.entries(balances)
    .filter(([, v]) => v > 0.01)
    .map(([id, amount]) => ({ id, amount }));

  const debtors = Object.entries(balances)
    .filter(([, v]) => v < -0.01)
    .map(([id, amount]) => ({ id, amount: -amount }));

  const transactions: Settlement["transactions"] = [];
  let ci = 0, di = 0;
  const c = creditors.map((x) => ({ ...x }));
  const d = debtors.map((x) => ({ ...x }));

  while (ci < c.length && di < d.length) {
    const amount = Math.min(c[ci].amount, d[di].amount);
    transactions.push({
      from: d[di].id,
      to: c[ci].id,
      amount: Math.round(amount * 100) / 100,
    });
    c[ci].amount -= amount;
    d[di].amount -= amount;
    if (c[ci].amount < 0.01) ci++;
    if (d[di].amount < 0.01) di++;
  }

  return { balances, transactions };
}
