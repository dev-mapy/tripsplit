"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export function Nav() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  return (
    <nav
      style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 40px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <Link
        href="/home"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          fontWeight: 700,
          background: "linear-gradient(135deg, #ffd200, #f7971e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          textDecoration: "none",
        }}
      >
        ✈️ TripSplit
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        {loading ? (
          <div style={{ color: "rgba(240,235,227,0.4)", fontSize: 14 }}>
            Loading...
          </div>
        ) : user ? (
          <button
            onClick={() => signOut()}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,210,0,0.3)",
              color: "#ffd200",
              borderRadius: 8,
              padding: "8px 16px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,210,0,0.3)",
              color: "#ffd200",
              borderRadius: 8,
              padding: "8px 16px",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "'Lato', sans-serif",
            }}
          >
            Sign In with Google
          </button>
        )}

        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Link
            href="/dashboard"
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 14,
              color: "rgba(240,235,227,0.5)",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            My Trips
          </Link>
          <Link
            href="/split"
            style={{
              background: "linear-gradient(135deg, #f7971e, #ffd200)",
              color: "#1a1a2e",
              borderRadius: 10,
              padding: "10px 24px",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              fontFamily: "'Lato', sans-serif",
              letterSpacing: "0.3px",
              transition: "all 0.2s",
            }}
          >
            Try it free →
          </Link>
        </div>
      </div>
    </nav>
  );
}
