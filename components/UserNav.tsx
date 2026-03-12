"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import SignInModal from "@/components/SignInModal";
import styles from "./UserNav.module.css";

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
          className={styles.signInButton}
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
    <div className={styles.container}>
      <button
        onClick={() => setShowMenu((v) => !v)}
        className={styles.userButton}
      >
        {/* Avatar */}
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="avatar"
            className={styles.avatar}
          />
        ) : (
          <div className={styles.avatarFallback}>
            {initials}
          </div>
        )}
        <span className={styles.userName}>
          {user.user_metadata?.full_name?.split(" ")[0] ?? "Account"}
        </span>
        <span className={styles.chevron}>
          ▾
        </span>
      </button>

      {/* Dropdown */}
      {showMenu && (
        <div className={styles.dropdown}>
          <Link
            href="/dashboard"
            onClick={() => setShowMenu(false)}
            className={styles.dropdownLink}
          >
            📋 My Trips
          </Link>
          <Link
            href="/split"
            onClick={() => setShowMenu(false)}
            className={styles.dropdownLink}
          >
            ✈️ New Trip
          </Link>
          <div className={styles.divider} />
          <button
            onClick={async () => {
              setShowMenu(false);
              await signOut();
            }}
            className={styles.signOutButton}
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
