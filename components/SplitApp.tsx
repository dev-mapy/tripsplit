"use client";

import { useTrip } from "@/lib/trip-context";
import TravelerSetup from "@/components/TravelerSetup";
import ExpenseList from "@/components/ExpenseList";
import Settlement from "@/components/Settlement";
import UserNav from "@/components/UserNav";

const STEPS = ["setup", "expenses", "result"] as const;
const STEP_LABELS = ["Trip Setup", "Expenses", "Settlement"];

export default function SplitApp() {
  const { step } = useTrip();

  return (
    <main style={{ minHeight: "100vh", padding: "0 0 80px", position: "relative", overflow: "hidden" }}>

      {/* Stars background */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: i % 5 === 0 ? 3 : 2,
            height: i % 5 === 0 ? 3 : 2,
            borderRadius: "50%",
            background: `rgba(255,255,255,${0.2 + (i % 5) * 0.1})`,
            top: `${(i * 37) % 100}%`,
            left: `${(i * 61) % 100}%`,
            animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${(i % 4) * 0.7}s`,
          }} />
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 680, margin: "0 auto", padding: "40px 20px 0" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✈️</div>
          <h1 style={{ fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 700, background: "linear-gradient(135deg, #ffd200, #f7971e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", margin: 0 }}>
            TripSplit
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 15 }}>
            No login. No drama. Just fair splits.
          </p>
          <a
            href="/home"
            style={{
              display: "inline-block",
              marginTop: 10,
              fontFamily: "'Lato', sans-serif",
              fontSize: 12,
              color: "rgba(240,235,227,0.3)",
              textDecoration: "none",
              letterSpacing: "0.3px",
            }}
          >
            ← About TripSplit
          </a>

          {/* User nav — top right */}
          <div style={{
            position: "absolute",
            top: 40,
            right: 20,
            zIndex: 10,
          }}>
            <UserNav />
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24 }}>
            {STEPS.map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  borderRadius: "50%",
                  transition: "all 0.3s",
                  width: step === s ? 12 : 10,
                  height: step === s ? 12 : 10,
                  background: step === s ? "#ffd200" : STEPS.indexOf(step) > i ? "rgba(255,210,0,0.5)" : "rgba(255,255,255,0.2)",
                }} />
                {i < 2 && <div style={{ width: 32, height: 1, background: "rgba(255,255,255,0.15)" }} />}
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 48, marginTop: 6, fontSize: 11, color: "var(--text-faint)", letterSpacing: "0.5px", textTransform: "uppercase" }}>
            {STEP_LABELS.map((l) => <span key={l}>{l}</span>)}
          </div>
        </div>

        {/* Step content */}
        {step === "setup"    && <TravelerSetup />}
        {step === "expenses" && <ExpenseList />}
        {step === "result"   && <Settlement />}
      </div>
    </main>
  );
}
