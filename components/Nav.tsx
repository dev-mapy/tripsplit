"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import styles from "./Nav.module.css";

export function Nav() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  return (
    <nav className={styles.nav}>
      <Link href="/home" className={styles.logo}>
        ✈️ TripSplit
      </Link>

      <div className={styles.right}>
        {loading ? (
          <div className={styles.loading}>
            Loading...
          </div>
        ) : user ? (
          <button
            onClick={() => signOut()}
            className={styles.authButton}
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className={styles.authButton}
          >
            Sign In with Google
          </button>
        )}

        <div className={styles.links}>
          <Link href="/dashboard" className={styles.myTrips}>
            My Trips
          </Link>
          <Link href="/split" className={styles.tryFree}>
            Try it free →
          </Link>
        </div>
      </div>
    </nav>
  );
}
