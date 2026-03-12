"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { saveTrip } from "@/lib/api";
import { useTrip } from "@/lib/trip-context";
import { CURRENCIES } from "@/lib/constants";
import { avatarColor, getInitial } from "@/lib/utils";

export default function TravelerSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const { trip, updateTripName, updateCurrency, addTraveler, removeTraveler, setStep } =
    useTrip();
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addTraveler(newName.trim());
    setNewName("");
  };

  const canContinue = trip.name.trim().length > 0 && trip.travelers.length >= 2;

  const handleContinue = async () => {
    if (!canContinue || loading) return;

    if (user) {
      setLoading(true);
      try {
        const { url } = await saveTrip({
          name: trip.name,
          slug: "",
          currencyCode: trip.currency.code,
          travelers: trip.travelers,
          expenses: trip.expenses,
        });
        router.push(`${url}?edit=1`);
      } catch (err) {
        console.error("Failed to auto-save trip:", err);
        setStep("expenses");
      } finally {
        setLoading(false);
      }
    } else {
      setStep("expenses");
    }
  };

  return (
    <div className="animate-fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* Trip name */}
      <div style={styles.card}>
        <label style={styles.label}>Trip Name</label>
        <input
          style={styles.input}
          placeholder="e.g. Bali Summer 2026 🌴"
          value={trip.name}
          onChange={(e) => updateTripName(e.target.value)}
        />

        <label style={{ ...styles.label, marginTop: 24 }}>Currency</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {CURRENCIES.map((c) => {
            const active = trip.currency.code === c.code;
            return (
              <button
                key={c.code}
                onClick={() => updateCurrency(c)}
                style={{
                  ...styles.pill,
                  background: active ? "rgba(255,210,0,0.2)" : "rgba(255,255,255,0.06)",
                  border: active ? "1px solid #ffd200" : "1px solid rgba(255,255,255,0.12)",
                  color: active ? "#ffd200" : "var(--text)",
                }}
              >
                {c.flag} {c.code}
              </button>
            );
          })}
        </div>
      </div>

      {/* Travelers */}
      <div style={styles.card}>
        <label style={styles.label}>Travelers</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {trip.travelers.map((t, i) => (
            <div key={t.id} className="animate-slide-in" style={styles.travelerRow}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ ...styles.avatar, background: avatarColor(i) }}>
                  {getInitial(t.name)}
                </div>
                <span>{t.name}</span>
              </div>
              {trip.travelers.length > 2 && (
                <button onClick={() => removeTraveler(t.id)} style={styles.removeBtn}>
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <input
            style={styles.input}
            placeholder="Add traveler name..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button style={styles.btnGhost} onClick={handleAdd}>
            + Add
          </button>
        </div>
      </div>

      <button
        style={{ ...styles.btnPrimary, opacity: canContinue && !loading ? 1 : 0.5 }}
        disabled={!canContinue || loading}
        onClick={handleContinue}
      >
        {loading ? "Saving..." : "Continue to Expenses →"}
      </button>
    </div>
  );
}

const styles = {
  card: {
    background: "var(--glass)",
    backdropFilter: "blur(12px)",
    border: "1px solid var(--glass-border)",
    borderRadius: 20,
    padding: 28,
  } as React.CSSProperties,
  label: {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "1px",
    textTransform: "uppercase" as const,
    color: "var(--text-muted)",
    marginBottom: 10,
  } as React.CSSProperties,
  input: {
    width: "100%",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    color: "var(--text)",
    padding: "12px 16px",
    fontSize: 15,
    outline: "none",
  } as React.CSSProperties,
  pill: {
    border: "none",
    borderRadius: 10,
    padding: "8px 14px",
    cursor: "pointer",
    fontSize: 14,
    transition: "all 0.2s",
  } as React.CSSProperties,
  travelerRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    padding: "12px 16px",
  } as React.CSSProperties,
  avatar: {
    width: 32,
    height: 32,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    fontWeight: 700,
    color: "#fff",
  } as React.CSSProperties,
  removeBtn: {
    background: "none",
    border: "none",
    color: "var(--text-faint)",
    cursor: "pointer",
    fontSize: 20,
    lineHeight: 1,
  } as React.CSSProperties,
  btnPrimary: {
    width: "100%",
    background: "linear-gradient(135deg, #f7971e, #ffd200)",
    color: "#1a1a2e",
    border: "none",
    borderRadius: 12,
    padding: "16px 28px",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
    transition: "all 0.2s",
  } as React.CSSProperties,
  btnGhost: {
    background: "rgba(255,255,255,0.08)",
    color: "var(--text)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 10,
    padding: "10px 18px",
    fontSize: 14,
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
  } as React.CSSProperties,
};
