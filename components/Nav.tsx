"use client";

import Link from "next/link";
import { UserNav } from "@/components/UserNav";

export function Nav() {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-6 max-w-6xl mx-auto">
      <Link href="/home" className="font-serif text-[22px] font-bold bg-linear-to-br from-gold to-gold-warm bg-clip-text text-transparent no-underline">
        ✈️ TripSplit
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/split"
          className="text-sm font-bold text-text-muted hover:text-white transition-colors no-underline hidden sm:block"
        >
          Try it free
        </Link>
        <UserNav />
      </div>
    </nav>
  );
}
