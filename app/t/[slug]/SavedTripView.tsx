"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth-context";
import { calcSettlement } from "@/lib/calculator";
import { CATEGORIES, MAX_EXPENSES } from "@/lib/constants";
import { avatarColor, getInitial, getBaseUrl, formatAmount } from "@/lib/utils";
import { updateTrip } from "@/lib/api";
import { useTrip } from "@/lib/swr";
import ShareButton from "@/components/ShareButton";
import AffiliateCard from "@/components/AffiliateCard";
import ExpenseForm from "@/components/ExpenseForm";
import Link from "next/link";
import type { Currency, Traveler, Expense, Trip } from "@/types";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { Badge } from "@/components/ui/Badge";
import { StarsBackground } from "@/components/ui/StarsBackground";
import { Layout } from "@/components/ui/Layout";
import { Toast } from "@/components/ui/Toast";

// Minimal TripProvider override for this page
import { TripProvider, TripContext } from "@/lib/trip-context";

interface Props {
  tripId: string;
  slug: string;
  userId: string;
  name: string;
  currency: Currency;
  travelers: Traveler[];
  expenses: Expense[];
  createdAt: string;
  updatedAt: string;
}

export default function SavedTripView(props: Props) {
  const { user } = useAuth();
  const isOwner = user?.id === props.userId;

  return (
    <TripProvider
      initialTrip={{
        name: props.name,
        currency: props.currency,
        travelers: props.travelers,
        expenses: props.expenses,
      }}
      isReadOnly={!isOwner}
    >
      <SavedTripContent {...props} isOwner={isOwner} />
    </TripProvider>
  );
}

function SavedTripContent({
  tripId,
  slug,
  userId,
  name: initialName,
  currency,
  travelers: initialTravelers,
  expenses: initialExpenses,
  createdAt,
  updatedAt: initialUpdatedAt,
  isOwner,
}: Props & { isOwner: boolean }) {
  const { trip: fetchedTrip, mutate } = useTrip(slug);

  const [travelers, setTravelers] = useState<Traveler[]>(initialTravelers);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [name] = useState(initialName);
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const hasUnsavedChanges = useRef(false);

  // Reconstruct a full SavedTrip for mutator fallbacks
  const baselineTrip = useMemo(() => ({
    id: tripId,
    slug,
    userId,
    name: initialName,
    currencyCode: currency.code,
    travelers: initialTravelers,
    expenses: initialExpenses,
    createdAt,
    updatedAt: initialUpdatedAt,
  }), [tripId, slug, userId, initialName, currency.code, initialTravelers, initialExpenses, createdAt, initialUpdatedAt]);

  // Sync with fetched data when it arrives, but only if no unsaved changes
  useEffect(() => {
    if (fetchedTrip && !hasUnsavedChanges.current) {
      setTravelers(fetchedTrip.travelers as unknown as Traveler[]);
      setExpenses(fetchedTrip.expenses as unknown as Expense[]);
      setUpdatedAt(fetchedTrip.updatedAt);
    }
  }, [fetchedTrip]);

  const sym = currency.symbol;
  const { balances, transactions } = calcSettlement(travelers, expenses);
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const getName = (id: string) =>
    travelers.find((t) => t.id === id)?.name ?? "?";

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    total: expenses
      .filter((e) => e.category === cat)
      .reduce((s, e) => s + e.amount, 0),
  }))
    .filter((x) => x.total > 0)
    .sort((a, b) => b.total - a.total);

  const handleSaveChanges = useCallback(async () => {
    setSaving(true);
    setSaveError(null);
    setSaved(true); // Optimistic "Saved" state

    const updatedData = {
      travelers,
      expenses,
      updatedAt: new Date().toISOString(),
    };

    const currentTrip = fetchedTrip || baselineTrip;

    try {
      await mutate(
        async () => {
          const res = await updateTrip(slug, { travelers, expenses });
          hasUnsavedChanges.current = false;
          return { ...currentTrip, ...updatedData, updatedAt: res.updatedAt };
        },
        {
          optimisticData: { ...currentTrip, ...updatedData },
          rollbackOnError: true,
          populateCache: true,
          revalidate: false,
        }
      );
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Update failed:", err);
      setSaved(false);
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes"
      );
      setShowToast(true);
    } finally {
      setSaving(false);
    }
  }, [slug, travelers, expenses, mutate, fetchedTrip, baselineTrip]);

  const lastUpdated = new Date(updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Layout variant="centered">
      <StarsBackground count={30} />

      <div className="flex items-center justify-between mb-10">
        <Link href="/split" className="text-xl font-serif font-bold text-gold hover:opacity-80 transition-opacity">
          ✈️ TripSplit
        </Link>
        <div className="flex items-center gap-4">
          {isOwner && (
            <Button variant="ghost" size="sm" href="/dashboard">
              My Trips
            </Button>
          )}
          <Button variant="ghost" size="sm" href="/split">
            New Trip ✈️
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Read-only banner for non-owners */}
        {!isOwner && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 flex items-start gap-4 animate-fade-up">
            <span className="text-2xl flex-shrink-0">👀</span>
            <div>
              <Typography variant="small" className="font-bold text-blue-300 mb-1">
                You&apos;re viewing a shared trip — read only.
              </Typography>
              <Typography variant="small" className="opacity-60">
                This is <strong className="opacity-100">{name}</strong>&apos;s trip split. You can view the settlement but cannot make changes.
              </Typography>
            </div>
          </div>
        )}

        {/* Owner: unsaved changes bar */}
        {isOwner && (
          <div className="bg-gold/5 border border-gold/10 rounded-2xl p-4 flex items-center justify-between gap-4 flex-wrap animate-fade-up">
            <Typography variant="small" className="opacity-50">
              {saved ? (
                <span className="text-green-400 font-bold">✓ Changes saved</span>
              ) : (
                <>Last updated {lastUpdated}</>
              )}
              {saveError && (
                <span className="text-red-400 ml-2">⚠️ {saveError}</span>
              )}
            </Typography>
            <Button
              variant={saved ? "secondary" : "primary"}
              size="sm"
              onClick={handleSaveChanges}
              disabled={saving}
              className={saved ? "text-green-400 border-green-400/30" : ""}
            >
              {saving ? "Saving..." : saved ? "✓ Saved" : "Save changes"}
            </Button>
          </div>
        )}

        {/* Trip header */}
        <Card className="text-center py-8 px-6 animate-fade-up">
          <Typography variant="h1" className="text-gold mb-2">{name}</Typography>
          <Typography variant="small" className="opacity-50 mb-8">
            {expenses.length} expenses · {travelers.length} travelers · {currency.flag} {currency.code}
          </Typography>

          <div className="flex justify-center gap-12 sm:gap-20 flex-wrap">
            <div>
              <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-1">Total Spent</Typography>
              <Typography variant="h2">{formatAmount(total, sym)}</Typography>
            </div>
            <div>
              <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-1">Per Person</Typography>
              <Typography variant="h2">{formatAmount(total / travelers.length, sym)}</Typography>
            </div>
          </div>
        </Card>

        {/* Share link */}
        <ShareButton overrideUrl={`${getBaseUrl()}/t/${slug}`} />

        {/* Affiliate: Klook */}
        <AffiliateCard
          name="Klook"
          emoji="🎟️"
          tagline="Tours & Activities"
          description="Book tours, activities, and experiences at the best price."
          cta="Book on Klook"
          href={process.env.NEXT_PUBLIC_KLOOK_URL!}
          qrCode="/affiliates/klook-qr-code.jpeg"
          accentColor="#FF5722"
        />

        {/* Balances */}
        <Card className="animate-fade-up">
          <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-6 block">Who Paid What</Typography>
          <div className="flex flex-col gap-3">
            {travelers.map((t, i) => {
              const paid = expenses
                .filter((e) => e.paidBy === t.id)
                .reduce((s, e) => s + e.amount, 0);
              const bal = balances[t.id] ?? 0;
              const isPos = bal > 0.01;
              const isNeg = bal < -0.01;
              return (
                <div key={t.id} className="flex items-center justify-between bg-white/5 rounded-xl p-4 animate-fade-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{ background: avatarColor(i) }}>
                      {getInitial(t.name)}
                    </div>
                    <div>
                      <Typography variant="body" className="font-bold">{t.name}</Typography>
                      <Typography variant="small" className="opacity-50">paid {formatAmount(paid, sym)}</Typography>
                    </div>
                  </div>
                  <div className="text-right">
                    <Typography variant="h3" className={isPos ? "text-green-400" : isNeg ? "text-red-400" : "opacity-40"}>
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

        {/* Settlement plan */}
        <Card className="animate-fade-up">
          <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-6 block">💸 Settlement Plan</Typography>
          {transactions.length === 0 ? (
            <div className="text-center py-6 opacity-40">
              🎉 Everyone is already settled up!
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {transactions.map((tx, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-gold/10 border border-gold/20 rounded-2xl animate-fade-up" style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
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

        {/* Expenses list (owner can edit) */}
        <Card className="animate-fade-up">
          <div className="flex justify-between items-center mb-6">
            <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold">All Expenses</Typography>
            {isOwner && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  if (expenses.length >= MAX_EXPENSES) return;
                  setEditingExpense(null);
                  setShowExpenseForm(true);
                }}
                disabled={expenses.length >= MAX_EXPENSES}
              >
                {expenses.length >= MAX_EXPENSES ? "Limit Reached" : "+ Add"}
              </Button>
            )}
          </div>

          {expenses.length === 0 ? (
            <div className="text-center py-8 opacity-40">No expenses yet.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {expenses.map((exp, i) => (
                <div
                  key={exp.id}
                  className={`flex items-center justify-between bg-white/5 rounded-xl p-4 transition-colors ${isOwner ? "cursor-pointer hover:bg-white/10" : ""}`}
                  onClick={() => { if (!isOwner) return; setEditingExpense(exp); setShowExpenseForm(true); }}
                  style={{ animationDelay: `${i * 0.03}s` }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{exp.category.split(" ")[0]}</span>
                    <div>
                      <Typography variant="body" className="font-bold">{exp.desc}</Typography>
                      <Typography variant="small" className="opacity-50">
                        Paid by <span className="text-gold opacity-100">{getName(exp.paidBy)}</span> · {exp.splitAmong.length} ways
                      </Typography>
                    </div>
                  </div>
                  <div className="text-right">
                    <Typography variant="h3">{formatAmount(exp.amount, sym)}</Typography>
                    <Typography variant="small" className="opacity-40">{formatAmount(exp.amount / exp.splitAmong.length, sym)}/ea</Typography>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Category breakdown */}
        {byCategory.length > 0 && (
          <Card className="animate-fade-up">
            <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-6 block">Spending Breakdown</Typography>
            <div className="flex flex-col gap-5">
              {byCategory.map(({ cat, total: catTotal }, i) => (
                <div key={cat} className="animate-fade-up" style={{ animationDelay: `${0.3 + i * 0.05}s` }}>
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
                        backgroundColor: `hsl(${i * 40 + 30}, 80%, 60%)`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Non-owner CTA */}
        {!isOwner && (
          <Card className="text-center py-10 bg-gold/5 border-gold/20 animate-fade-up">
            <Typography variant="small" className="opacity-50 mb-6 block">Planning your own trip?</Typography>
            <Button href="/split" size="lg">Start your own trip ✈️</Button>
            <Typography variant="small" className="opacity-30 mt-4 block">Free · No login required</Typography>
          </Card>
        )}
      </div>

      {showToast && saveError && (
        <Toast
          message={saveError}
          type="error"
          onClose={() => setShowToast(false)}
          onRetry={() => {
            setShowToast(false);
            handleSaveChanges();
          }}
        />
      )}

      {/* Expense form modal (owner only) */}
      {showExpenseForm && isOwner && (
        <ExpenseFormAdapter
          editing={editingExpense}
          travelers={travelers}
          currency={currency}
          onSave={(exp) => {
            hasUnsavedChanges.current = true;
            if (editingExpense) {
              setExpenses((prev) =>
                prev.map((e) => (e.id === editingExpense.id ? exp : e))
              );
            } else {
              setExpenses((prev) => [...prev, exp]);
            }
            setShowExpenseForm(false);
          }}
          onDelete={(id) => {
            hasUnsavedChanges.current = true;
            setExpenses((prev) => prev.filter((e) => e.id !== id));
            setShowExpenseForm(false);
          }}
          onClose={() => setShowExpenseForm(false)}
        />
      )}
    </Layout>
  );
}

// Inline adapter so ExpenseForm works outside TripContext on this page
function ExpenseFormAdapter({
  editing,
  travelers,
  currency,
  onSave,
  onDelete,
  onClose,
}: {
  editing: Expense | null;
  travelers: Traveler[];
  currency: Currency;
  onSave: (exp: Expense) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}) {
  const trip: Trip = {
    name: "",
    currency,
    travelers,
    expenses: [], // Not used by form
  };

  return (
    <TripContext.Provider
      value={{
        trip,
        step: "expenses",
        setStep: () => {},
        updateTripName: () => {},
        updateCurrency: () => {},
        addTraveler: () => {},
        removeTraveler: () => {},
        addExpense: (exp) => onSave({ ...exp, id: Math.random().toString(36).substr(2, 9) }),
        updateExpense: (id, exp) => onSave({ ...exp, id }),
        deleteExpense: onDelete,
        resetTrip: () => {},
        shareUrl: "",
        isSharedView: false,
        isReadOnly: false,
      }}
    >
      <ExpenseForm editing={editing} onClose={onClose} />
    </TripContext.Provider>
  );
}
