"use client";

import { useTrip } from "@/lib/trip-context";
import { calcSettlement } from "@/lib/calculator";
import { CATEGORIES } from "@/lib/constants";
import { avatarColor, getInitial } from "@/lib/utils";
import ShareButton from "@/components/ShareButton";
import SaveTripButton from "@/components/SaveTripButton";
import KlookCard from "@/components/KlookCard";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { formatAmount } from "@/lib/utils";

export default function Settlement() {
  const { trip, setStep, resetTrip, isSharedView } = useTrip();
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

      {/* ── Read-only banner (shared view) ── */}
      {isSharedView && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex items-start gap-4 animate-fade-up">
          <span className="text-2xl flex-shrink-0">👀</span>
          <div>
            <Typography variant="small" className="font-bold text-blue-300 mb-1">
              You&apos;re viewing a shared trip — read only.
            </Typography>
            <Typography variant="small" className="opacity-60 leading-relaxed">
              This is {trip.name ? <><strong className="opacity-100">{trip.name}</strong>&apos;s</> : "someone else's"} trip split. You can view the settlement but cannot make changes.
            </Typography>
          </div>
        </div>
      )}

      {/* ── Trip header ── */}
      <Card className="text-center py-8 px-6 animate-fade-up">
        <Typography variant="h1" className="text-gold mb-2">{trip.name}</Typography>
        <Typography variant="small" className="opacity-50 mb-8 block">
          {trip.expenses.length} expenses · {trip.travelers.length} travelers · {trip.currency.flag} {trip.currency.code}
        </Typography>
        <div className="flex justify-center gap-12 sm:gap-20 flex-wrap">
          <div>
            <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-1 block">Total Spent</Typography>
            <Typography variant="h2">{formatAmount(total, sym)}</Typography>
          </div>
          <div>
            <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-1 block">Per Person</Typography>
            <Typography variant="h2">{formatAmount(total / trip.travelers.length, sym)}</Typography>
          </div>
        </div>
      </Card>

      {/* ── Share link ── */}
      <ShareButton />

      {/* ── Save trip (owner only, not shown in shared view) ── */}
      {!isSharedView && <SaveTripButton />}

      {/* ── Balances ── */}
      <Card className="animate-fade-up">
        <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-6 block">Who Paid What</Typography>
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
                className="flex items-center justify-between bg-white/5 rounded-xl p-4 animate-slide-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ background: avatarColor(i) }}
                  >
                    {getInitial(t.name)}
                  </div>
                  <div>
                    <Typography variant="body" className="font-bold">{t.name}</Typography>
                    <Typography variant="small" className="opacity-50">
                      paid {formatAmount(paid, sym)}
                    </Typography>
                  </div>
                </div>
                <div className="text-right">
                  <Typography
                    variant="h3"
                    className={isPos ? "text-green-400" : isNeg ? "text-red-400" : "opacity-40"}
                  >
                    {isPos
                      ? `+${formatAmount(bal, sym)}`
                      : isNeg
                      ? `-${formatAmount(-bal, sym)}`
                      : `${sym}0.00`}
                  </Typography>
                  <Typography variant="small" className="opacity-40 uppercase tracking-tighter text-[10px] font-bold">
                    {isPos ? "gets back" : isNeg ? "owes" : "settled ✓"}
                  </Typography>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ── Settlement plan ── */}
      <Card className="animate-fade-up">
        <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-6 block">💸 Settlement Plan</Typography>
        {transactions.length === 0 ? (
          <div className="text-center py-6 opacity-40">
            🎉 Everyone is already settled up!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {transactions.map((tx, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-5 bg-gold/10 border border-gold/20 rounded-2xl animate-fade-up"
                style={{ animationDelay: `${0.3 + i * 0.1}s` }}
              >
                <div className="flex-1">
                  <span className="font-bold text-red-400">{getName(tx.from)}</span>
                  <span className="mx-3 opacity-40">→ pays →</span>
                  <span className="font-bold text-green-400">{getName(tx.to)}</span>
                </div>
                <Typography variant="h2" className="text-gold">
                  {formatAmount(tx.amount, sym)}
                </Typography>
              </div>
            ))}
          </div>
        )}
      </Card>

      <KlookCard />

      {/* ── Category breakdown ── */}
      {byCategory.length > 0 && (
        <Card className="animate-fade-up">
          <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-6 block">Spending Breakdown</Typography>
          <div className="flex flex-col gap-5">
            {byCategory.map(({ cat, total: catTotal }, i) => (
              <div
                key={cat}
                className="animate-fade-up"
                style={{ animationDelay: `${0.5 + i * 0.07}s` }}
              >
                <div className="flex justify-between mb-2">
                  <Typography variant="small">{cat}</Typography>
                  <Typography variant="small" className="font-bold">
                    {formatAmount(catTotal, sym)} · {((catTotal / total) * 100).toFixed(0)}%
                  </Typography>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(catTotal / total) * 100}%`,
                      backgroundColor: `hsl(${i * 40 + 30},80%,60%)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── Action buttons ── */}
      {isSharedView ? (
        <Card className="text-center py-10 bg-gold/5 border-gold/20 animate-fade-up">
          <Typography variant="small" className="opacity-50 mb-6 block">Planning your own trip?</Typography>
          <Button href="/split" size="lg">Start your own trip ✈️</Button>
          <Typography variant="small" className="opacity-30 mt-4 block">Free · No login required</Typography>
        </Card>
      ) : (
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
