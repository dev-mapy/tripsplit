"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/Button";

export function Nav() {
  const { user, signInWithGoogle, signOut, loading } = useAuth();

  return (
    <nav className="relative z-10 flex items-center justify-between px-10 py-6 max-w-[1100px] mx-auto md:flex-row flex-col gap-4">
      <Link href="/home" className="font-serif text-[22px] font-bold bg-linear-to-br from-gold to-gold-warm bg-clip-text text-transparent no-underline">
        ✈️ TripSplit
      </Link>

      <div className="flex items-center gap-5 md:w-auto w-full justify-center">
        {loading ? (
          <div className="text-text-faint text-sm">
            Loading...
          </div>
        ) : user ? (
          <button
            onClick={() => signOut()}
            className="bg-transparent border border-gold/30 text-gold rounded-lg px-4 py-2 font-bold text-[13px] cursor-pointer font-sans"
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => signInWithGoogle()}
            className="bg-transparent border border-gold/30 text-gold rounded-lg px-4 py-2 font-bold text-[13px] cursor-pointer font-sans"
          >
            Sign In with Google
          </button>
        )}

        <div className="flex gap-3 items-center">
          <Link href="/dashboard" className="hidden sm:block font-sans text-sm text-text-muted no-underline font-bold">
            My Trips
          </Link>
          <Link href="/split" className="bg-linear-to-br from-gold-warm to-gold text-[#1a1a2e] rounded-lg px-6 py-2.5 font-bold text-sm no-underline font-sans tracking-[0.3px] transition-all">
            Try it free →
          </Link>
        </div>
      </div>
    </nav>
  );
}
