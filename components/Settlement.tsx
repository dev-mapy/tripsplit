"use client";

import { useTrip } from "@/lib/trip-context";
import { calcSettlement } from "@/lib/calculator";
import { CATEGORIES } from "@/lib/constants";
import { avatarColor, getInitial } from "@/lib/utils";
import ShareButton from "@/components/ShareButton";
import KlookCard from "@/components/KlookCard";
import Link from "next/link";

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
    <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── Read-only banner (shared view) ── */}
      {isSharedView && (
        <div style={{
          background: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.35)",
          borderRadius: 16,
          padding: "16px 20px",
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>👀</span>
          <div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontWeight: 700, color: "#a5b4fc", fontSize: 14, marginBottom: 4 }}>
              You&apos;re viewing a shared trip — read only.
            </div>
            <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 13, color: "rgba(240,235,227,0.45)", lineHeight: 1.6 }}>
              This is {trip.name ? <><strong style={{ color: "rgba(240,235,227,0.7)" }}>{trip.name}</strong>&apos;s</> : "someone else's"} trip split. You can view the settlement but cannot make changes.
            </div>
          </div>
        </div>
      )}

      {/* ── Trip header ── */}
      <div style={{ ...card, textAlign: "center", padding: 28 }}>
        <h2 style={{ fontSize: 28, color: "var(--gold)", marginBottom: 4 }}>{trip.name}</h2>
        <div style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
          {trip.expenses.length} expenses · {trip.travelers.length} travelers · {trip.currency.flag} {trip.currency.code}
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap" }}>
          <div>
            <div style={statLabel}>Total Spent</div>
            <div style={statValue}>{sym}{total.toFixed(2)}</div>
          </div>
          <div>
            <div style={statLabel}>Per Person</div>
            <div style={statValue}>{sym}{(total / trip.travelers.length).toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* ── Share link ── */}
      <ShareButton />

      {/* ── Balances ── */}
      <div style={card}>
        <div style={sectionLabel}>Who Paid What</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
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
                className="animate-slide-in"
                style={{ ...row, animationDelay: `${i * 0.08}s` }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ ...avatar, background: avatarColor(i) }}>
                    {getInitial(t.name)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                      paid {sym}{paid.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: 18,
                    fontWeight: 700,
                    color: isPos ? "var(--success)" : isNeg ? "var(--danger)" : "var(--text-muted)",
                  }}>
                    {isPos
                      ? `+${sym}${bal.toFixed(2)}`
                      : isNeg
                      ? `-${sym}${(-bal).toFixed(2)}`
                      : `${sym}0.00`}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text-faint)" }}>
                    {isPos ? "gets back" : isNeg ? "owes" : "settled ✓"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Settlement plan ── */}
      <div style={card}>
        <div style={sectionLabel}>💸 Settlement Plan</div>
        {transactions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "20px 0", color: "var(--text-muted)" }}>
            🎉 Everyone is already settled up!
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                <div style={{ flex: 1, fontSize: 15, fontFamily: "'Lato', sans-serif" }}>
                  <span style={{ fontWeight: 700, color: "var(--danger)" }}>{getName(tx.from)}</span>
                  <span style={{ color: "var(--text-muted)", margin: "0 10px" }}>→ pays →</span>
                  <span style={{ fontWeight: 700, color: "var(--success)" }}>{getName(tx.to)}</span>
                </div>
                <div style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "var(--gold)",
                }}>
                  {sym}{tx.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <KlookCard />

      {/* ── Category breakdown ── */}
      {byCategory.length > 0 && (
        <div style={card}>
          <div style={sectionLabel}>Spending Breakdown</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {byCategory.map(({ cat, total: catTotal }, i) => (
              <div
                key={cat}
                className="animate-slide-in"
                style={{ animationDelay: `${0.5 + i * 0.07}s` }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 6, fontFamily: "'Lato', sans-serif" }}>
                  <span>{cat}</span>
                  <span style={{ fontWeight: 700 }}>
                    {sym}{catTotal.toFixed(2)} · {((catTotal / total) * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ height: 6, background: "rgba(255,255,255,0.1)", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${(catTotal / total) * 100}%`,
                    background: `hsl(${i * 40 + 30},80%,60%)`,
                    borderRadius: 3,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Action buttons ── */}
      {isSharedView ? (
        /* Read-only CTA — can't edit, can start their own trip */
        <div style={{
          ...card,
          textAlign: "center",
          padding: "28px 24px",
          background: "rgba(255,210,0,0.05)",
          border: "1px solid rgba(255,210,0,0.15)",
        }}>
          <div style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "'Lato', sans-serif", marginBottom: 16 }}>
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
          <div style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 12, fontFamily: "'Lato', sans-serif" }}>
            Free · No login required
          </div>
        </div>
      ) : (
        /* Owner CTA — can edit or start new */
        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ ...btnGhost, flex: 1 }} onClick={() => setStep("expenses")}>
            ← Edit Expenses
          </button>
          <button style={{ ...btnPrimary, flex: 1 }} onClick={resetTrip}>
            New Trip ✈️
          </button>
        </div>
      )}
    </div>
  );
}

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
};
const statLabel: React.CSSProperties = {
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "1px",
  color: "var(--text-muted)",
};
const statValue: React.CSSProperties = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 36,
  fontWeight: 700,
};
const btnPrimary: React.CSSProperties = {
  background: "linear-gradient(135deg, #f7971e, #ffd200)",
  color: "#1a1a2e",
  border: "none",
  borderRadius: 12,
  padding: "14px 28px",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
};
const btnGhost: React.CSSProperties = {
  background: "rgba(255,255,255,0.08)",
  color: "var(--text)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 10,
  padding: "10px 18px",
  fontSize: 14,
  cursor: "pointer",
};
