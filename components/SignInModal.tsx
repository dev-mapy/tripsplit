"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getCleanBaseUrl } from "@/lib/utils";

interface Props {
  onClose: () => void;
  reason?: "save" | "dashboard";
}

export default function SignInModal({
  onClose,
  reason = "save",
}: Props) {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in error:", error);
      setLoading(false);
    }
  };

  const messages = {
    save: {
      title: "Save your trip",
      desc: `Sign in to save this trip permanently and get a clean shareable link like ${getCleanBaseUrl()}/t/bali-2026.`,
      perks: [
        "✈️ Clean custom link instead of a long URL",
        "📋 Trip history — access all your past trips",
        "✏️ Edit your trip anytime",
        "🔒 Only you can make changes",
      ],
    },
    dashboard: {
      title: "View your trips",
      desc: "Sign in to access your saved trips and history.",
      perks: [
        "📋 All your trips in one place",
        "✈️ Clean shareable links",
        "✏️ Edit trips anytime",
      ],
    },
  };

  const msg = messages[reason];

  return (
    <div
      style={overlay}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="animate-pop-in" style={modal}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "none",
            border: "none",
            color: "rgba(240,235,227,0.3)",
            fontSize: 24,
            cursor: "pointer",
            lineHeight: 1,
          }}
        >
          ×
        </button>

        {/* Icon */}
        <div style={{ fontSize: 48, marginBottom: 16, textAlign: "center" }}>
          ✈️
        </div>

        {/* Title */}
        <h2
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 26,
            fontWeight: 700,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          {msg.title}
        </h2>

        {/* Description */}
        <p
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 14,
            color: "rgba(240,235,227,0.55)",
            textAlign: "center",
            lineHeight: 1.7,
            marginBottom: 24,
          }}
        >
          {msg.desc}
        </p>

        {/* Perks */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 12,
            padding: "16px 20px",
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          {msg.perks.map((perk) => (
            <div
              key={perk}
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 14,
                color: "rgba(240,235,227,0.7)",
              }}
            >
              {perk}
            </div>
          ))}
        </div>

        {/* Google Sign In Button */}
        <button
          onClick={handleSignIn}
          disabled={loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            background: "#fff",
            color: "#1a1a2e",
            border: "none",
            borderRadius: 12,
            padding: "14px 24px",
            fontFamily: "'Lato', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s",
            marginBottom: 14,
          }}
        >
          {/* Google SVG Icon */}
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? "Signing in..." : "Continue with Google"}
        </button>

        {/* No login reassurance */}
        <div
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 12,
            color: "rgba(240,235,227,0.3)",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          TripSplit still works without signing in.
          <br />
          Signing in is only needed to save trips permanently.
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(6px)",
  zIndex: 200,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 20,
};

const modal: React.CSSProperties = {
  position: "relative",
  background: "rgba(20,18,48,0.98)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 24,
  padding: "36px 28px 28px",
  width: "100%",
  maxWidth: 420,
};
