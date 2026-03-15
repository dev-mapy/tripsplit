"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useTripLimit } from "@/lib/trip-limit-context";
import SignInModal from "@/components/SignInModal";
import { Button } from "@/components/ui/Button";
import { ENABLE_AUTH } from "@/lib/constants";

interface UserNavProps {
  userName?: string;
  userAvatar?: string | null;
  onSignOut?: () => void;
}

export function UserNav({ userName, userAvatar, onSignOut }: UserNavProps) {
  const { user, loading, signOut } = useAuth();
  const { count, limit, isFull } = useTripLimit();
  const [showMenu, setShowMenu] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!ENABLE_AUTH || loading) return null;

  // If props are provided, use them (legacy/direct usage in Dashboard)
  const displayUser = user || (userName ? { user_metadata: { full_name: userName, avatar_url: userAvatar }, email: "" } : null);

  if (!displayUser) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSignIn(true)}
        >
          Sign in
        </Button>

        {showSignIn && (
          <SignInModal
            onClose={() => setShowSignIn(false)}
            reason="dashboard"
          />
        )}
      </>
    );
  }

  const initials = displayUser.user_metadata?.full_name
    ? displayUser.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : displayUser.email?.[0].toUpperCase() ?? "?";

  const avatarUrl = displayUser.user_metadata?.avatar_url;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu((v) => !v)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer group"
      >
        {avatarUrl && !imageError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover border border-white/10"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-[13px] font-black text-white">
            <span className="mb-[1px]">{initials}</span>
          </div>
        )}
        <div className="hidden sm:flex flex-col items-start leading-tight">
          <span className="text-sm font-bold text-text-muted group-hover:text-white transition-colors">
            {displayUser.user_metadata?.full_name?.split(" ")[0] ?? "Account"}
          </span>
          {user && (
            <span className={`text-[10px] font-black font-sans uppercase tracking-widest ${isFull ? "text-red-400" : "text-brand-light"}`}>
              {count}/{limit} trips
            </span>
          )}
        </div>
        <span className="text-text-faint text-[10px] group-hover:text-white transition-colors">
          ▾
        </span>
      </button>

      {showMenu && (
        <div className="absolute right-0 mt-3 w-48 bg-bg-deep/95 backdrop-blur-xl border border-glass-border rounded-2xl p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <Link
            href="/dashboard"
            onClick={() => setShowMenu(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            📋 My Trips
          </Link>
          <Link
            href="/split"
            onClick={() => setShowMenu(false)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-text-muted hover:text-white hover:bg-white/5 rounded-xl transition-all"
          >
            ✈️ New Trip
          </Link>
          <div className="h-px bg-white/5 my-1.5 mx-2" />
          <button
            onClick={async () => {
              setShowMenu(false);
              if (onSignOut) {
                onSignOut();
              } else {
                await signOut();
              }
            }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-xl transition-all text-left"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
