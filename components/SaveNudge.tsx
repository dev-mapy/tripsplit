"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import SignInModal from "@/components/SignInModal";
import { Typography } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { getCleanBaseUrl } from "@/lib/utils";

export default function SaveNudge() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  // Don't show if already signed in or dismissed
  if (user || dismissed) return null;

  return (
    <>
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4 flex-wrap animate-fade-up">
        <span className="text-xl flex-shrink-0">💡</span>
        <div className="flex-1 min-w-[200px]">
          <Typography variant="small" className="opacity-70 leading-relaxed">
            <strong className="opacity-100 text-blue-300">Want a cleaner link?</strong>{" "}
            Sign in with Google to save trips at{" "}
            <span className="font-mono text-[11px] bg-white/5 px-1 rounded">{ getCleanBaseUrl() }/t/your-trip</span>{" "}
            and access your history anytime.
          </Typography>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowSignIn(true)}
            className="text-blue-300 border-blue-500/30 hover:bg-blue-500/20"
          >
            Sign in →
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="text-text-faint hover:text-white transition-colors cursor-pointer text-xl p-1"
          >
            ×
          </button>
        </div>
      </div>

      {showSignIn && (
        <SignInModal
          onClose={() => setShowSignIn(false)}
          reason="save"
        />
      )}
    </>
  );
}
