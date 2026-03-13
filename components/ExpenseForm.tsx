"use client";

import { useState, useEffect } from "react";
import { useTrip } from "@/lib/trip-context";
import { CATEGORIES } from "@/lib/constants";
import type { Expense } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatCurrency } from "@/lib/utils";

interface Props {
  editing: Expense | null;
  onClose: () => void;
}

export default function ExpenseForm({ editing, onClose }: Props) {
  const { trip, addExpense, updateExpense, deleteExpense } = useTrip();
  const sym = trip.currency.symbol;

  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState(""); // Displayed string with commas
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [paidBy, setPaidBy] = useState(trip.travelers[0]?.id ?? "");
  const [splitAmong, setSplitAmong] = useState<string[]>(
    trip.travelers.map((t) => t.id)
  );

  useEffect(() => {
    if (editing) {
      setDesc(editing.desc);
      setAmount(formatCurrency(editing.amount));
      setCategory(editing.category);
      setPaidBy(editing.paidBy);
      setSplitAmong(editing.splitAmong);
    }
  }, [editing]);

  const toggleSplit = (id: string) => {
    setSplitAmong((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Helper to parse comma-formatted string back to number
  const parseAmount = (val: string) => {
    const clean = val.replace(/,/g, "");
    return parseFloat(clean);
  };

  const currentAmount = parseAmount(amount);

  const perPerson =
    !isNaN(currentAmount) && splitAmong.length > 0
      ? (currentAmount / splitAmong.length).toFixed(2)
      : null;

  const isValid = desc.trim() && !isNaN(currentAmount) && currentAmount > 0 && splitAmong.length > 0;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    // 1. Extract digits and dots, removing commas
    let clean = raw.replace(/,/g, "").replace(/[^0-9.]/g, "");

    // 2. Handle multiple dots by keeping only the first one
    const dotIndex = clean.indexOf(".");
    if (dotIndex !== -1) {
      const before = clean.slice(0, dotIndex);
      const after = clean.slice(dotIndex + 1).replace(/\./g, "");
      clean = `${before}.${after}`;
    }

    // 3. Split into parts
    const [intPart, decPart] = clean.split(".");

    // 4. Limit integer part to 8 digits and decimal to 2
    let finalInt = intPart.slice(0, 8);
    let finalDec = decPart !== undefined ? decPart.slice(0, 2) : undefined;

    // 5. Format the integer part with commas
    let formattedInt = "";
    if (finalInt !== "") {
      const n = parseInt(finalInt);
      if (!isNaN(n)) {
        formattedInt = n.toLocaleString("en-US");
      }
    }

    // 6. Final assembly - setAmount ensures the input remains controlled and clean
    if (finalDec !== undefined) {
      setAmount(`${formattedInt}.${finalDec}`);
    } else {
      // Check if it should have a trailing dot
      if (clean.includes(".")) {
        setAmount(`${formattedInt}.`);
      } else {
        setAmount(formattedInt);
      }
    }
  };

  // On blur, ensure it looks like a currency if it's not empty
  const handleAmountBlur = () => {
    if (amount === "") return;
    const num = parseAmount(amount);
    if (!isNaN(num)) {
      setAmount(formatCurrency(num));
    }
  };

  const handleSave = () => {
    if (!isValid) return;
    const payload = { desc: desc.trim(), amount: currentAmount, category, paidBy, splitAmong };
    if (editing) {
      updateExpense(editing.id, payload);
    } else {
      addExpense(payload);
    }
    onClose();
  };

  const handleDelete = () => {
    if (editing) deleteExpense(editing.id);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-5 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Card className="w-full max-auto max-w-[480px] p-7 md:p-8 animate-pop-in relative">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h2">{editing ? "Edit Expense" : "Add Expense"}</Typography>
          <button
            onClick={onClose}
            className="bg-none border-none text-text-faint hover:text-white text-3xl cursor-pointer transition-colors"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-2 block">
              Description
            </Typography>
            <input
              className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-[15px] text-text outline-none focus:border-gold/50 focus:bg-white/12 transition-all"
              placeholder="e.g. Dinner at the beach"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-2 block">
                Amount ({sym})
              </Typography>
              <input
                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-[15px] text-text outline-none focus:border-gold/50 focus:bg-white/12 transition-all font-mono"
                placeholder="0.00"
                value={amount}
                onChange={handleAmountChange}
                onBlur={handleAmountBlur}
              />
            </div>
            <div className="flex-1 relative">
              <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-2 block">
                Category
              </Typography>
              <select
                className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-[15px] text-text outline-none focus:border-gold/50 focus:bg-white/12 transition-all appearance-none cursor-pointer"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#1e1b3c] text-white">
                    {c}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 bottom-3.5 pointer-events-none text-text-faint text-[10px]">
                ▼
              </div>
            </div>
          </div>

          <div>
            <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-3 block">
              Paid By
            </Typography>
            <div className="flex flex-wrap gap-2">
              {trip.travelers.map((t) => {
                const active = paidBy === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setPaidBy(t.id)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                      ${active
                        ? "bg-gold/15 border border-gold text-gold"
                        : "bg-white/8 border border-white/12 text-text opacity-70 hover:opacity-100 hover:bg-white/12"}
                    `}
                  >
                    {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-3 block">
              Split Among
            </Typography>
            <div className="flex flex-wrap gap-2">
              {trip.travelers.map((t) => {
                const active = splitAmong.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleSplit(t.id)}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                      ${active
                        ? "bg-gold/15 border border-gold text-gold"
                        : "bg-white/8 border border-white/12 text-text opacity-70 hover:opacity-100 hover:bg-white/12"}
                    `}
                  >
                    {active ? "✓ " : ""}{t.name}
                  </button>
                );
              })}
            </div>
          </div>

          {perPerson && (
            <div className="bg-gold/10 border border-gold/20 rounded-xl p-4 text-sm">
              <span className="opacity-60">Each person pays: </span>
              <span className="text-gold font-bold">{sym}{new Intl.NumberFormat("en-US").format(parseFloat(perPerson))}</span>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            {editing && (
              <Button
                variant="ghost"
                onClick={handleDelete}
                className="text-red-400 border-red-400/30 hover:bg-red-400/10"
              >
                Delete
              </Button>
            )}
            <Button
              onClick={handleSave}
              disabled={!isValid}
              className="flex-1"
            >
              {editing ? "Save Changes ✓" : "Add Expense ✓"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
