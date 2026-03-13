"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import ExpenseForm from "@/components/ExpenseForm";
import ShareButton from "@/components/ShareButton";
import YesimCard from "@/components/YesimCard";
import type { Expense } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

export default function ExpenseList() {
  const { trip, setStep } = useTrip();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Expense | null>(null);

  const sym = trip.currency.symbol;
  const total = trip.expenses.reduce((s, e) => s + e.amount, 0);
  const getName = (id: string) => trip.travelers.find((t) => t.id === id)?.name ?? "?";

  const openAdd = () => { setEditing(null); setShowForm(true); };
  const openEdit = (exp: Expense) => { setEditing(exp); setShowForm(true); };

  return (
    <>
      <div className="animate-fade-up flex flex-col gap-4">
        {/* Summary bar */}
        <Card className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6 px-8">
          <div>
            <Typography variant="h2" className="mb-1">{trip.name}</Typography>
            <Typography variant="small" className="opacity-50">
              {trip.travelers.map((t) => t.name).join(" · ")} · {trip.currency.flag} {trip.currency.code}
            </Typography>
          </div>
          <div className="sm:text-right">
            <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-1 block">Total Spent</Typography>
            <Typography variant="h2" className="text-gold">{sym}{total.toFixed(2)}</Typography>
          </div>
        </Card>

        {/* Expense rows */}
        {trip.expenses.length === 0 ? (
          <div className="text-center py-20 opacity-40">
            <div className="text-5xl mb-6">🧾</div>
            <Typography variant="body">No expenses yet. Add your first one!</Typography>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {trip.expenses.map((exp, i) => (
              <div
                key={exp.id}
                className="bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/8 rounded-2xl p-5 flex items-center justify-between gap-4 cursor-pointer transition-all animate-slide-in"
                onClick={() => openEdit(exp)}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-center gap-5">
                  <div className="text-3xl w-10 text-center">
                    {exp.category.split(" ")[0]}
                  </div>
                  <div>
                    <Typography variant="body" className="font-bold">{exp.desc}</Typography>
                    <Typography variant="small" className="opacity-50 mt-1 block">
                      Paid by <span className="text-gold opacity-100">{getName(exp.paidBy)}</span> · Split {exp.splitAmong.length} ways
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Typography variant="h3">{sym}{exp.amount.toFixed(2)}</Typography>
                  <Typography variant="small" className="opacity-30">{sym}{(exp.amount / exp.splitAmong.length).toFixed(2)}/ea</Typography>
                </div>
              </div>
            ))}
          </div>
        )}

        {trip.expenses.length > 0 && <ShareButton />}
        <YesimCard />

        <div className="flex gap-2 mt-4">
          <Button variant="secondary" className="flex-1" size="md" onClick={openAdd}>
            + Add Expense
          </Button>
          <Button variant="ghost" size="md" onClick={() => setStep("setup")}>
            ← Back
          </Button>
        </div>

        {trip.expenses.length > 0 && (
          <Button size="lg" className="w-full" onClick={() => setStep("result")}>
            Calculate Settlement 🧮
          </Button>
        )}
      </div>

      {showForm && <ExpenseForm editing={editing} onClose={() => setShowForm(false)} />}
    </>
  );
}
