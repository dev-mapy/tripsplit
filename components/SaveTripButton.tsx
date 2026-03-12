"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTrip } from "@/lib/trip-context";
import { saveTrip } from "@/lib/api";
import { getCleanBaseUrl } from "@/lib/utils";
import SignInModal from "@/components/SignInModal";

export default function SaveTripButton() {
  const { user } = useAuth();
  const { trip } = useTrip();
  const router = useRouter();

  const [showSignIn, setShowSignIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    // Not signed in — show sign in modal
    if (!user) {
      setShowSignIn(true);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { url } = await saveTrip({
        name: trip.name,
        slug: "",
        currencyCode: trip.currency.code,
        travelers: trip.travelers,
        expenses: trip.expenses,
      });

      // Redirect to the saved trip page
      router.push(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save trip");
      setSaving(false);
    }
  };

  return (
    <>
      <div
        style={{
          background: "rgba(255,210,0,0.06)",
          border: "1px solid rgba(255,210,0,0.2)",
          borderRadius: 16,
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 200 }}>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 17,
                fontWeight: 600,
                marginBottom: 6,
                color: "#ffd200",
              }}
            >
              💾 Save this trip
            </div>
            <div
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 13,
                color: "rgba(240,235,227,0.5)",
                lineHeight: 1.6,
              }}
            >
              Get a clean link like{" "}
              <span
                style={{
                  fontFamily: "monospace",
                  color: "rgba(240,235,227,0.7)",
                  fontSize: 12,
                }}
              >
                {getCleanBaseUrl()}/t/bali-2026
              </span>{" "}
              and access this trip anytime.
            </div>

            {error && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "#f87171",
                  fontFamily: "'Lato', sans-serif",
                }}
              >
                ⚠️ {error}
              </div>
            )}
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              background: saving
                ? "rgba(255,210,0,0.3)"
                : "linear-gradient(135deg, #f7971e, #ffd200)",
              color: "#1a1a2e",
              border: "none",
              borderRadius: 10,
              padding: "12px 22px",
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              cursor: saving ? "not-allowed" : "pointer",
              whiteSpace: "nowrap",
              transition: "all 0.2s",
              flexShrink: 0,
            }}
          >
            {saving ? "Saving..." : user ? "Save trip →" : "Sign in to save →"}
          </button>
        </div>
      </div>

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} reason="save" />}
    </>
  );
}
