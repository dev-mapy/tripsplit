"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import SignInModal from "@/components/SignInModal";

export default function UserNav() {
  const { user, loading, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  if (loading) return null;

  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowSignIn(true)}
          style={{
            background: "rgba(255,255,255,0.08)",
            color: "rgba(240,235,227,0.7)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 10,
            padding: "8px 18px",
            fontFamily: "'Lato', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Sign in
        </button>

        {showSignIn && (
          <SignInModal
            onClose={() => setShowSignIn(false)}
            reason="dashboard"
          />
        )}
      </>
    );
  }

  const initials = user.user_metadata?.full_name
    ? user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.[0].toUpperCase() ?? "?";

  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setShowMenu((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 10,
          padding: "6px 14px 6px 6px",
          cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {/* Avatar */}
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="avatar"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f7971e, #ffd200)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#1a1a2e",
            }}
          >
            {initials}
          </div>
        )}
        <span
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 13,
            color: "rgba(240,235,227,0.8)",
            fontWeight: 700,
          }}
        >
          {user.user_metadata?.full_name?.split(" ")[0] ?? "Account"}
        </span>
        <span style={{ fontSize: 10, color: "rgba(240,235,227,0.4)" }}>
          ▾
        </span>
      </button>

      {/* Dropdown */}
      {showMenu && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            background: "rgba(20,18,48,0.98)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 12,
            padding: 8,
            minWidth: 180,
            zIndex: 50,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <Link
            href="/dashboard"
            onClick={() => setShowMenu(false)}
            style={{
              display: "block",
              padding: "10px 14px",
              fontFamily: "'Lato', sans-serif",
              fontSize: 14,
              color: "rgba(240,235,227,0.8)",
              textDecoration: "none",
              borderRadius: 8,
              transition: "background 0.15s",
            }}
          >
            📋 My Trips
          </Link>
          <Link
            href="/split"
            onClick={() => setShowMenu(false)}
            style={{
              display: "block",
              padding: "10px 14px",
              fontFamily: "'Lato', sans-serif",
              fontSize: 14,
              color: "rgba(240,235,227,0.8)",
              textDecoration: "none",
              borderRadius: 8,
            }}
          >
            ✈️ New Trip
          </Link>
          <div
            style={{
              height: 1,
              background: "rgba(255,255,255,0.08)",
              margin: "6px 0",
            }}
          />
          <button
            onClick={async () => {
              setShowMenu(false);
              await signOut();
            }}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "10px 14px",
              fontFamily: "'Lato', sans-serif",
              fontSize: 14,
              color: "#f87171",
              background: "none",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
