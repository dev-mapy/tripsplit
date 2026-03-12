"use client";

import { useState, useCallback } from "react";
import { useAuth } from "@/lib/auth-context";
import { calcSettlement } from "@/lib/calculator";
import { CATEGORIES } from "@/lib/constants";
import { avatarColor, getInitial } from "@/lib/utils";
import { updateTrip } from "@/lib/api";
import ShareButton from "@/components/ShareButton";
import AffiliateCard from "@/components/AffiliateCard";
import ExpenseForm from "@/components/ExpenseForm";
import Link from "next/link";
import type { Currency, Traveler, Expense, Trip } from "@/types";

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
  return (
    <TripProvider
      initialTrip={{
        name: props.name,
        currency: props.currency,
        travelers: props.travelers,
        expenses: props.expenses,
      }}
    >
      <SavedTripContent {...props} />
    </TripProvider>
  );
}

function SavedTripContent({
  slug,
  userId,
  name: initialName,
  currency,
  travelers: initialTravelers,
  expenses: initialExpenses,
  updatedAt,
}: Props) {
  const { user } = useAuth();
  const isOwner = user?.id === userId;

  const [travelers, setTravelers] = useState<Traveler[]>(initialTravelers);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [name] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);

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
    try {
      await updateTrip(slug, { travelers, expenses });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes"
      );
    } finally {
      setSaving(false);
    }
  }, [slug, travelers, expenses]);

  const lastUpdated = new Date(updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "0 0 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Stars */}
      <div
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 5 === 0 ? 3 : 2,
              height: i % 5 === 0 ? 3 : 2,
              borderRadius: "50%",
              background: `rgba(255,255,255,${0.2 + (i % 5) * 0.1})`,
              top: `${(i * 37) % 100}%`,
              left: `${(i * 61) % 100}%`,
              animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i % 4) * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 680,
          margin: "0 auto",
          padding: "40px 20px 0",
        }}
      >
        {/* Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 40,
          }}
        >
          <Link
            href="/split"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20,
              fontWeight: 700,
              background: "linear-gradient(135deg, #ffd200, #f7971e)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textDecoration: "none",
            }}
          >
            ✈️ TripSplit
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {isOwner && (
              <Link
                href="/dashboard"
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 13,
                  color: "rgba(240,235,227,0.5)",
                  textDecoration: "none",
                }}
              >
                My Trips
              </Link>
            )}
            <Link
              href="/split"
              style={{
                background: "linear-gradient(135deg, #f7971e, #ffd200)",
                color: "#1a1a2e",
                borderRadius: 10,
                padding: "8px 18px",
                fontFamily: "'Lato', sans-serif",
                fontWeight: 700,
                fontSize: 13,
                textDecoration: "none",
              }}
            >
              New Trip ✈️
            </Link>
          </div>
        </div>

        <div
          className="animate-fade-up"
          style={{ display: "flex", flexDirection: "column", gap: 20 }}
        >
          {/* Read-only banner for non-owners */}
          {!isOwner && (
            <div
              style={{
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.35)",
                borderRadius: 16,
                padding: "16px 20px",
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
              }}
            >
              <span style={{ fontSize: 22, flexShrink: 0 }}>👀</span>
              <div>
                <div
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    fontWeight: 700,
                    color: "#a5b4fc",
                    fontSize: 14,
                    marginBottom: 4,
                  }}
                >
                  You&apos;re viewing a shared trip — read only.
                </div>
                <div
                  style={{
                    fontFamily: "'Lato', sans-serif",
                    fontSize: 13,
                    color: "rgba(240,235,227,0.45)",
                  }}
                >
                  This is{" "}
                  <strong style={{ color: "rgba(240,235,227,0.7)" }}>
                    {name}
                  </strong>
                  . You can view the settlement but cannot make changes.
                </div>
              </div>
            </div>
          )}

          {/* Owner: unsaved changes bar */}
          {isOwner && (
            <div
              style={{
                background: "rgba(255,210,0,0.06)",
                border: "1px solid rgba(255,210,0,0.2)",
                borderRadius: 12,
                padding: "12px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div
                style={{
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 13,
                  color: "rgba(240,235,227,0.45)",
                }}
              >
                {saved ? (
                  <span style={{ color: "#4ade80" }}>✓ Changes saved</span>
                ) : (
                  <>Last updated {lastUpdated}</>
                )}
                {saveError && (
                  <span style={{ color: "#f87171", marginLeft: 8 }}>
                    ⚠️ {saveError}
                  </span>
                )}
              </div>
              <button
                onClick={handleSaveChanges}
                disabled={saving}
                style={{
                  background: saved
                    ? "rgba(74,222,128,0.2)"
                    : "linear-gradient(135deg, #f7971e, #ffd200)",
                  color: saved ? "#4ade80" : "#1a1a2e",
                  border: saved ? "1px solid rgba(74,222,128,0.4)" : "none",
                  borderRadius: 8,
                  padding: "8px 18px",
                  fontFamily: "'Lato', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1,
                  whiteSpace: "nowrap",
                }}
              >
                {saving ? "Saving..." : saved ? "✓ Saved" : "Save changes"}
              </button>
            </div>
          )}

          {/* Trip header */}
          <div style={{ ...card, textAlign: "center", padding: 28 }}>
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28,
                color: "var(--gold)",
                marginBottom: 4,
              }}
            >
              {name}
            </h1>
            <div
              style={{
                fontSize: 14,
                color: "var(--text-muted)",
                fontFamily: "'Lato', sans-serif",
                marginBottom: 20,
              }}
            >
              {expenses.length} expenses · {travelers.length} travelers ·{" "}
              {currency.flag} {currency.code}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 40,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={statLabel}>Total Spent</div>
                <div style={statValue}>
                  {sym}
                  {total.toFixed(2)}
                </div>
              </div>
              <div>
                <div style={statLabel}>Per Person</div>
                <div style={statValue}>
                  {sym}
                  {(total / travelers.length).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Share link */}
          <ShareButton overrideUrl={`${process.env.NEXT_PUBLIC_APP_URL ?? ""}/t/${slug}`} />

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
          <div style={card}>
            <div style={sectionLabel}>Who Paid What</div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: 10 }}
            >
              {travelers.map((t, i) => {
                const paid = expenses
                  .filter((e) => e.paidBy === t.id)
                  .reduce((s, e) => s + e.amount, 0);
                const bal = balances[t.id] ?? 0;
                const isPos = bal > 0.01;
                const isNeg = bal < -0.01;
                return (
                  <div
                    key={t.id}
                    className="animate-slide-in"
                    style={{
                      ...row,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <div
                        style={{
                          ...avatar,
                          background: avatarColor(i),
                        }}
                      >
                        {getInitial(t.name)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700 }}>{t.name}</div>
                        <div
                          style={{
                            fontSize: 13,
                            color: "var(--text-muted)",
                            fontFamily: "'Lato', sans-serif",
                          }}
                        >
                          paid {sym}
                          {paid.toFixed(2)}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 18,
                          fontWeight: 700,
                          color: isPos
                            ? "var(--success)"
                            : isNeg
                            ? "var(--danger)"
                            : "var(--text-muted)",
                        }}
                      >
                        {isPos
                          ? `+${sym}${bal.toFixed(2)}`
                          : isNeg
                          ? `-${sym}${(-bal).toFixed(2)}`
                          : `${sym}0.00`}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-faint)",
                          fontFamily: "'Lato', sans-serif",
                        }}
                      >
                        {isPos ? "gets back" : isNeg ? "owes" : "settled ✓"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Settlement plan */}
          <div style={card}>
            <div style={sectionLabel}>💸 Settlement Plan</div>
            {transactions.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "20px 0",
                  color: "var(--text-muted)",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                🎉 Everyone is already settled up!
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {transactions.map((tx, i) => (
                  <div
                    key={i}
                    className="animate-slide-in"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "16px 20px",
                      background: "rgba(255,210,0,0.08)",
                      border: "1px solid rgba(255,210,0,0.2)",
                      borderRadius: 14,
                      animationDelay: `${0.3 + i * 0.1}s`,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        fontSize: 15,
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--danger)",
                        }}
                      >
                        {getName(tx.from)}
                      </span>
                      <span
                        style={{
                          color: "var(--text-muted)",
                          margin: "0 10px",
                        }}
                      >
                        → pays →
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--success)",
                        }}
                      >
                        {getName(tx.to)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 22,
                        fontWeight: 700,
                        color: "var(--gold)",
                      }}
                    >
                      {sym}
                      {tx.amount.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Expenses list (owner can edit) */}
          <div style={card}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <div style={sectionLabel}>All Expenses</div>
              {isOwner && (
                <button
                  onClick={() => {
                    setEditingExpense(null);
                    setShowExpenseForm(true);
                  }}
                  style={{
                    background: "rgba(255,210,0,0.15)",
                    border: "1px solid rgba(255,210,0,0.3)",
                    borderRadius: 8,
                    padding: "6px 14px",
                    fontFamily: "'Lato', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#ffd200",
                    cursor: "pointer",
                  }}
                >
                  + Add
                </button>
              )}
            </div>

            {expenses.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "24px 0",
                  color: "var(--text-muted)",
                  fontFamily: "'Lato', sans-serif",
                  fontSize: 14,
                }}
              >
                No expenses yet.
              </div>
            ) : (
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {expenses.map((exp, i) => (
                  <div
                    key={exp.id}
                    className="animate-slide-in"
                    onClick={() => {
                      if (!isOwner) return;
                      setEditingExpense(exp);
                      setShowExpenseForm(true);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      background: "rgba(255,255,255,0.04)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      cursor: isOwner ? "pointer" : "default",
                      animationDelay: `${i * 0.04}s`,
                      transition: "background 0.15s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <span style={{ fontSize: 20 }}>
                        {exp.category.split(" ")[0]}
                      </span>
                      <div>
                        <div
                          style={{
                            fontFamily: "'Lato', sans-serif",
                            fontWeight: 700,
                            fontSize: 14,
                          }}
                        >
                          {exp.desc}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Lato', sans-serif",
                            fontSize: 12,
                            color: "var(--text-muted)",
                          }}
                        >
                          Paid by{" "}
                          <span style={{ color: "var(--gold)" }}>
                            {getName(exp.paidBy)}
                          </span>{" "}
                          · {exp.splitAmong.length} ways
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontFamily: "'Playfair Display', serif",
                          fontSize: 18,
                          fontWeight: 600,
                        }}
                      >
                        {sym}
                        {exp.amount.toFixed(2)}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--text-faint)",
                          fontFamily: "'Lato', sans-serif",
                        }}
                      >
                        {sym}
                        {(exp.amount / exp.splitAmong.length).toFixed(2)}/ea
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category breakdown */}
          {byCategory.length > 0 && (
            <div style={card}>
              <div style={sectionLabel}>Spending Breakdown</div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
              >
                {byCategory.map(({ cat, total: catTotal }, i) => (
                  <div
                    key={cat}
                    className="animate-slide-in"
                    style={{ animationDelay: `${0.5 + i * 0.07}s` }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 14,
                        marginBottom: 6,
                        fontFamily: "'Lato', sans-serif",
                      }}
                    >
                      <span>{cat}</span>
                      <span style={{ fontWeight: 700 }}>
                        {sym}
                        {catTotal.toFixed(2)} ·{" "}
                        {((catTotal / total) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 6,
                        background: "rgba(255,255,255,0.1)",
                        borderRadius: 3,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${(catTotal / total) * 100}%`,
                          background: `hsl(${i * 40 + 30},80%,60%)`,
                          borderRadius: 3,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Non-owner CTA */}
          {!isOwner && (
            <div
              style={{
                ...card,
                textAlign: "center",
                padding: "28px 24px",
                background: "rgba(255,210,0,0.05)",
                border: "1px solid rgba(255,210,0,0.15)",
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  fontFamily: "'Lato', sans-serif",
                  marginBottom: 16,
                }}
              >
                Planning your own trip?
              </div>
              <Link
                href="/split"
                style={{
                  display: "inline-block",
                  background: "linear-gradient(135deg, #f7971e, #ffd200)",
                  color: "#1a1a2e",
                  borderRadius: 12,
                  padding: "14px 32px",
                  fontWeight: 700,
                  fontSize: 15,
                  textDecoration: "none",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Start your own trip ✈️
              </Link>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-faint)",
                  marginTop: 12,
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                Free · No login required
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expense form modal (owner only) */}
      {showExpenseForm && isOwner && (
        <ExpenseFormAdapter
          editing={editingExpense}
          travelers={travelers}
          currency={currency}
          onSave={(exp) => {
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
            setExpenses((prev) => prev.filter((e) => e.id !== id));
            setShowExpenseForm(false);
          }}
          onClose={() => setShowExpenseForm(false)}
        />
      )}
    </main>
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
      }}
    >
      <ExpenseForm editing={editing} onClose={onClose} />
    </TripContext.Provider>
  );
}

// Styles
const card: React.CSSProperties = {
  background: "var(--glass)",
  backdropFilter: "blur(12px)",
  border: "1px solid var(--glass-border)",
  borderRadius: 20,
  padding: 24,
};
const row: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "rgba(255,255,255,0.05)",
  borderRadius: 12,
  padding: "14px 18px",
};
const avatar: React.CSSProperties = {
  width: 38,
  height: 38,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 16,
  fontWeight: 700,
  color: "#fff",
  flexShrink: 0,
};
const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  marginBottom: 16,
  fontFamily: "'Lato', sans-serif",
};
const statLabel: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "var(--text-muted)",
  fontFamily: "'Lato', sans-serif",
};
const statValue: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 36,
  fontWeight: 700,
};
