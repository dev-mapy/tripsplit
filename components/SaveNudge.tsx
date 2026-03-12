"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import SignInModal from "@/components/SignInModal";

export default function SaveNudge() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  // Don't show if already signed in or dismissed
  if (user || dismissed) return null;

  return (
    <>
      <div
        style={{
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.2)",
          borderRadius: 14,
          padding: "14px 18px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 20, flexShrink: 0 }}>💡</span>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 13,
              color: "rgba(240,235,227,0.65)",
              lineHeight: 1.6,
            }}
          >
            <strong style={{ color: "rgba(240,235,227,0.85)" }}>
              Want a cleaner link?
            </strong>{" "}
            Sign in with Google to save trips at{" "}
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                color: "rgba(240,235,227,0.6)",
              }}
            >
              tripsplit.app/t/your-trip
            </span>{" "}
            and access your history anytime.
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setShowSignIn(true)}
            style={{
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.35)",
              borderRadius: 8,
              padding: "7px 14px",
              fontFamily: "'Lato', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: "#a5b4fc",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Sign in →
          </button>
          <button
            onClick={() => setDismissed(true)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(240,235,227,0.25)",
              cursor: "pointer",
              fontSize: 18,
              lineHeight: 1,
              padding: "0 4px",
            }}
          >
            ×
          </button>
        </div>
      </div>

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          reason="save"
        />
      )}
    </>
  );
}
