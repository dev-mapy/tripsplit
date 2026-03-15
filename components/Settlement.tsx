"use client";

import { useTrip } from "@/lib/trip-context";
import { calcSettlement } from "@/lib/calculator";
import { CATEGORIES } from "@/lib/constants";
import { avatarColor, getInitial } from "@/lib/utils";
import ShareButton from "@/components/ShareButton";
import SaveTripButton from "@/components/SaveTripButton";
import KlookCard from "@/components/KlookCard";
import MakeItOwn from "@/components/MakeItOwn";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatAmount } from "@/lib/utils";

export default function Settlement() {
  const { trip, setStep, resetTrip, isReadOnly, isSharedView, hasBeenModified } = useTrip();
  const isViewer = isSharedView && !hasBeenModified;
  const sym = trip.currency.symbol;
  const { balances, transactions } = calcSettlement(trip.travelers, trip.expenses);
  const total = trip.expenses.reduce((s, e) => s + e.amount, 0);
  const getName = (id: string) => trip.travelers.find((t) => t.id === id)?.name ?? "?";

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    total: trip.expenses
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + e.amount, 0),
  }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="animate-fade-up flex flex-col gap-5">

      {/* ── Trip header ── */}
      <Card className="text-center py-8 px-6 animate-fade-up min-w-0 border-white/5 bg-white/[0.02]">
        <Typography variant="h2" className="text-brand-light mb-2 truncate" title={trip.name}>{trip.name}</Typography>
        <Typography variant="small" className="opacity-50 mb-8 block text-[13px]">
          {trip.expenses.length} expenses · {trip.travelers.length} travelers · {trip.currency.flag} {trip.currency.code}
        </Typography>
        <div className="flex justify-center gap-12 sm:gap-20 flex-wrap">
          <div>
            <Typography variant="sub" className="text-text-faint mb-1 block">Total Spent</Typography>
            <Typography variant="h2" className="text-[32px]">{formatAmount(total, sym)}</Typography>
          </div>
          <div>
            <Typography variant="sub" className="text-text-faint mb-1 block">Per Person</Typography>
            <Typography variant="h2" className="text-[32px]">{formatAmount(total / trip.travelers.length, sym)}</Typography>
          </div>
        </div>
      </Card>

      {/* ── Share link ── */}
      {!isViewer && <ShareButton />}

      {/* ── Save trip ── */}
      {!isReadOnly && !isViewer && <SaveTripButton />}

      {/* ── Balances ── */}
      <Card className="animate-fade-up border-white/5 bg-white/[0.02]">
        <Typography variant="sub" className="text-text-faint mb-6 block">Who Paid What</Typography>
        <div className="flex flex-col gap-3">
          {trip.travelers.map((t, i) => {
            const paid = trip.expenses
              .filter((e) => e.paidBy === t.id)
              .reduce((s, e) => s + e.amount, 0);
            const bal = balances[t.id] ?? 0;
            const isPos = bal > 0.01;
            const isNeg = bal < -0.01;
            return (
              <div
                key={t.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between bg-white/5 border border-white/5 rounded-xl p-4 animate-slide-in gap-3 sm:gap-4"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-black"
                    style={{ background: i === 0 ? "var(--color-brand)" : "#475569" }}
                  >
                    {getInitial(t.name)}
                  </div>
                  <div>
                    <Typography variant="body" className="font-black text-white text-[15px]">{t.name}</Typography>
                    <Typography variant="small" className="opacity-50 text-[12px]">
                      paid {formatAmount(paid, sym)}
                    </Typography>
                  </div>
                </div>
                <div className="flex flex-col items-start sm:items-end">
                  <Typography
                    variant="h3"
                    className={`text-[18px] ${isPos ? "text-success" : isNeg ? "text-danger" : "opacity-40"}`}
                  >
                    {isPos
                      ? `+${formatAmount(bal, sym)}`
                      : isNeg
                      ? `-${formatAmount(-bal, sym)}`
                      : `${sym}0.00`}
                  </Typography>
                  <Typography variant="sub" className="text-text-faint text-[10px]">
                    {isPos ? "gets back" : isNeg ? "owes" : "settled ✓"}
                  </Typography>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Settlement plan ── */}
      <Card className="animate-fade-up border-white/5 bg-white/[0.02]">
        <Typography variant="sub" className="text-text-faint mb-6 block">💸 Settlement Plan</Typography>
        {transactions.length === 0 ? (
          <div className="text-center py-6 opacity-40">
            🎉 Everyone is already settled up!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((tx, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-brand/10 border border-brand/20 rounded-2xl animate-fade-up gap-4"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-0 min-w-0 flex-1">
                  <span className="font-black text-danger text-[16px] truncate max-w-[120px] sm:max-w-none" title={getName(tx.from)}>{getName(tx.from)}</span>
                  <div className="flex flex-col items-center sm:flex-row sm:mx-3 opacity-40 text-[10px] sm:text-[13px] leading-none uppercase font-black tracking-widest">
                    <span className="sm:hidden">↓</span>
                    <span>pays</span>
                    <span className="sm:hidden">↓</span>
                    <span className="hidden sm:inline">→</span>
                  </div>
                  <span className="font-black text-success text-[16px] truncate max-w-[120px] sm:max-w-none" title={getName(tx.to)}>{getName(tx.to)}</span>
                </div>
                <Typography variant="h2" className="text-brand-light text-left sm:text-right text-[24px]">
                  {formatAmount(tx.amount, sym)}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </Card>

      <KlookCard />

      {isViewer && (
        <div className="flex flex-col gap-4 animate-fade-up">
          {isReadOnly ? (
            <Button size="lg" onClick={resetTrip} className="w-full">
              Create your own new trip ✈️
            </Button>
          ) : (
            <MakeItOwn />
          )}
        </div>
      )}

      {/* ── Category breakdown ── */}
      {byCategory.length > 0 && (
        <Card className="animate-fade-up border-white/5 bg-white/[0.02]">
          <Typography variant="sub" className="text-text-faint mb-6 block">Spending Breakdown</Typography>
          <div className="flex flex-col gap-5">
            {byCategory.map(({ cat, total: catTotal }, i) => (
              <div
                key={cat}
                className="animate-fade-up"
                style={{ animationDelay: `${0.5 + i * 0.07}s` }}
              >
                <div className="flex justify-between mb-2">
                  <Typography variant="small" className="text-white font-bold">{cat}</Typography>
                  <Typography variant="small" className="font-bold text-text-muted">
                    {formatAmount(catTotal, sym)} · {((catTotal / total) * 100).toFixed(0)}%
                  </Typography>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(catTotal / total) * 100}%`,
                      backgroundColor: `hsl(${i * 40 + 210}, 70%, 50%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Action buttons ── */}
      {!isReadOnly && !isViewer && (
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setStep("expenses")}
            >
              ← Edit Expenses
            </Button>
            <Button className="flex-1" onClick={resetTrip}>
              New Trip ✈️
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
