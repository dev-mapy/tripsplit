"use client";

import Link from "next/link";
import { UserNav } from "@/components/UserNav";

export function Nav() {
  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-8 max-w-6xl mx-auto">
      <Link href="/home" className="flex items-center gap-2 font-sans text-[20px] font-black text-white no-underline tracking-tight">
        <div className="bg-brand w-8 h-8 rounded-lg flex items-center justify-center text-[18px]">✈️</div>
        TripSplit
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/split"
          className="text-[13px] font-black text-text-muted hover:text-white transition-colors no-underline hidden sm:block uppercase tracking-widest"
        >
          Try it free
        </Link>
        <UserNav />
      </div>
    </nav>
  );
}
