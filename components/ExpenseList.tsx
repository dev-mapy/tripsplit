"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import ExpenseForm from "@/components/ExpenseForm";
import ShareButton from "@/components/ShareButton";
import type { Expense } from "@/types";

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
      <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* Summary bar */}
        <div style={{ ...card, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, padding: "16px 24px" }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600 }}>{trip.name}</div>
            <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
              {trip.travelers.map((t) => t.name).join(" · ")} · {trip.currency.flag} {trip.currency.code}
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--text-muted)" }}>Total Spent</div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, color: "var(--gold)" }}>{sym}{total.toFixed(2)}</div>
          </div>
        </div>

        {/* Expense rows */}
        {trip.expenses.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0", color: "var(--text-muted)" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🧾</div>
            <div>No expenses yet. Add your first one!</div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {trip.expenses.map((exp, i) => (
              <div
                key={exp.id}
                className="animate-slide-in"
                onClick={() => openEdit(exp)}
                style={{ ...card, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, cursor: "pointer", animationDelay: `${i * 0.05}s`, transition: "transform 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "none")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 24, minWidth: 36, textAlign: "center" }}>
                    {exp.category.split(" ")[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{exp.desc}</div>
                    <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                      Paid by <span style={{ color: "var(--gold)" }}>{getName(exp.paidBy)}</span> · Split {exp.splitAmong.length} ways
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right", minWidth: 80 }}>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600 }}>{sym}{exp.amount.toFixed(2)}</div>
                  <div style={{ fontSize: 12, color: "var(--text-faint)" }}>{sym}{(exp.amount / exp.splitAmong.length).toFixed(2)}/ea</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {trip.expenses.length > 0 && <ShareButton />}

        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ ...btnGhost, flex: 1, fontSize: 15 }} onClick={openAdd}>+ Add Expense</button>
          <button style={btnGhost} onClick={() => setStep("setup")}>← Back</button>
        </div>

        {trip.expenses.length > 0 && (
          <button style={btnPrimary} onClick={() => setStep("result")}>
            Calculate Settlement 🧮
          </button>
        )}
      </div>

      {showForm && <ExpenseForm editing={editing} onClose={() => setShowForm(false)} />}
    </>
  );
}

const card: React.CSSProperties = { background: "var(--glass)", backdropFilter: "blur(12px)", border: "1px solid var(--glass-border)", borderRadius: 16, padding: 16 };
const btnPrimary: React.CSSProperties = { width: "100%", background: "linear-gradient(135deg, #f7971e, #ffd200)", color: "#1a1a2e", border: "none", borderRadius: 12, padding: "16px", fontWeight: 700, fontSize: 16, cursor: "pointer" };
const btnGhost: React.CSSProperties = { background: "rgba(255,255,255,0.08)", color: "var(--text)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 18px", fontSize: 14, cursor: "pointer" };
