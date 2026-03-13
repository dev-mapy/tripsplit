"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getCleanBaseUrl } from "@/lib/utils";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

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
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-100 flex items-center justify-center p-5"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <Card className="relative p-9 max-w-[420px] w-full animate-pop-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-text-faint hover:text-white text-3xl transition-colors cursor-pointer"
        >
          ×
        </button>

        {/* Icon */}
        <div className="text-5xl mb-6 text-center">✈️</div>

        {/* Title */}
        <Typography variant="h2" className="text-center mb-3">{msg.title}</Typography>

        {/* Description */}
        <Typography variant="body" className="text-center opacity-60 mb-8 leading-relaxed">
          {msg.desc}
        </Typography>

        {/* Perks */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-8 flex flex-col gap-3">
          {msg.perks.map((perk) => (
            <Typography key={perk} variant="small" className="opacity-80">
              {perk}
            </Typography>
          ))}
        </div>

        {/* Google Sign In Button */}
        <Button
          onClick={handleSignIn}
          disabled={loading}
          variant="secondary"
          className="w-full bg-white text-bg-deep hover:bg-white/90 border-none mb-4 py-4"
        >
          {loading ? (
            <span className="animate-spin mr-2">🌀</span>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" className="mr-3">
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
          )}
          {loading ? "Signing in..." : "Continue with Google"}
        </Button>

        {/* No login reassurance */}
        <Typography variant="small" className="text-center opacity-30 leading-relaxed">
          TripSplit still works without signing in.
          <br />
          Signing in is only needed to save trips permanently.
        </Typography>
      </Card>
    </div>
  );
}
