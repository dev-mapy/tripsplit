"use client";

import { useState, useEffect } from "react";
import { useTrip } from "@/lib/trip-context";
import { CATEGORIES } from "@/lib/constants";
import type { Expense } from "@/types";

interface Props {
  editing: Expense | null;
  onClose: () => void;
}

export default function ExpenseForm({ editing, onClose }: Props) {
  const { trip, addExpense, updateExpense, deleteExpense } = useTrip();
  const sym = trip.currency.symbol;

  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [paidBy, setPaidBy] = useState(trip.travelers[0]?.id ?? "");
  const [splitAmong, setSplitAmong] = useState<string[]>(
    trip.travelers.map((t) => t.id)
  );

  useEffect(() => {
    if (editing) {
      setDesc(editing.desc);
      setAmount(String(editing.amount));
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

  const perPerson =
    amount && splitAmong.length > 0
      ? (parseFloat(amount) / splitAmong.length).toFixed(2)
      : null;

  const isValid = desc.trim() && amount && splitAmong.length > 0;

  const handleSave = () => {
    if (!isValid) return;
    const payload = { desc: desc.trim(), amount: parseFloat(amount), category, paidBy, splitAmong };
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
    <div style={overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="animate-pop-in" style={modal}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22 }}>{editing ? "Edit Expense" : "Add Expense"}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--text-faint)", fontSize: 26, cursor: "pointer" }}>×</button>
        </div>

        <label style={lbl}>Description</label>
        <input style={inp} placeholder="e.g. Dinner at the beach" value={desc} onChange={(e) => setDesc(e.target.value)} />

        <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
          <div style={{ flex: 1 }}>
            <label style={lbl}>Amount ({sym})</label>
            <input style={inp} type="number" min="0" step="0.01" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </div>
          <div style={{ flex: 1, position: "relative" }}>
            <label style={lbl}>Category</label>
            <select style={{ ...inp, appearance: "none", cursor: "pointer" }} value={category} onChange={(e) => setCategory(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c} style={{ background: "#24243e", color: "#fff" }}>
                  {c}
                </option>
              ))}
            </select>
            <div style={{ position: "absolute", right: 12, bottom: 12, pointerEvents: "none", color: "var(--text-faint)", fontSize: 12 }}>
              ▼
            </div>
          </div>
        </div>

        <label style={lbl}>Paid By</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {trip.travelers.map((t) => {
            const active = paidBy === t.id;
            return (
              <button key={t.id} onClick={() => setPaidBy(t.id)} style={{ ...pill, background: active ? "rgba(255,210,0,0.2)" : "rgba(255,255,255,0.05)", border: active ? "1px solid #ffd200" : "1px solid rgba(255,255,255,0.12)", color: active ? "#ffd200" : "var(--text)" }}>
                {t.name}
              </button>
            );
          })}
        </div>

        <label style={lbl}>Split Among</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
          {trip.travelers.map((t) => {
            const active = splitAmong.includes(t.id);
            return (
              <button key={t.id} onClick={() => toggleSplit(t.id)} style={{ ...pill, background: active ? "rgba(255,210,0,0.2)" : "rgba(255,255,255,0.05)", border: active ? "1px solid #ffd200" : "1px solid rgba(255,255,255,0.12)", color: active ? "#ffd200" : "var(--text)" }}>
                {active ? "✓ " : ""}{t.name}
              </button>
            );
          })}
        </div>

        {perPerson && (
          <div style={{ background: "rgba(255,210,0,0.08)", border: "1px solid rgba(255,210,0,0.2)", borderRadius: 10, padding: "12px 16px", marginBottom: 20, fontSize: 14, color: "var(--text-muted)" }}>
            Each person pays: <strong style={{ color: "#ffd200" }}>{sym}{perPerson}</strong>
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          {editing && (
            <button onClick={handleDelete} style={{ ...btnGhost, color: "#f87171", borderColor: "rgba(248,113,113,0.3)" }}>
              Delete
            </button>
          )}
          <button onClick={handleSave} disabled={!isValid} style={{ ...btnPrimary, flex: 1, opacity: isValid ? 1 : 0.5 }}>
            {editing ? "Save Changes ✓" : "Add Expense ✓"}
          </button>
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 };
const modal: React.CSSProperties = { background: "rgba(30,27,60,0.97)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: 28, width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto" };
const lbl: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 8 };
const inp: React.CSSProperties = { width: "100%", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, color: "var(--text)", padding: "12px 16px", fontSize: 15, outline: "none" };
const pill: React.CSSProperties = { border: "none", borderRadius: 20, padding: "8px 14px", cursor: "pointer", fontSize: 14, transition: "all 0.15s" };
const btnPrimary: React.CSSProperties = { background: "linear-gradient(135deg, #f7971e, #ffd200)", color: "#1a1a2e", border: "none", borderRadius: 12, padding: "14px 28px", fontWeight: 700, fontSize: 15, cursor: "pointer" };
const btnGhost: React.CSSProperties = { background: "rgba(255,255,255,0.08)", color: "var(--text)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 18px", fontSize: 14, cursor: "pointer" };
