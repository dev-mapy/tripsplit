"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTrip } from "@/lib/trip-context";
import { useTripLimit } from "@/lib/trip-limit-context";
import { saveTrip } from "@/lib/api";
import { getCleanBaseUrl } from "@/lib/utils";
import SignInModal from "@/components/SignInModal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

export default function SaveTripButton() {
  const { user } = useAuth();
  const { trip } = useTrip();
  const { count, limit, isFull, refresh } = useTripLimit();
  const router = useRouter();

  const [showSignIn, setShowSignIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    // Not signed in — show sign in modal
    if (!user) {
      setShowSignIn(true);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const { url } = await saveTrip({
        name: trip.name,
        slug: "",
        currencyCode: trip.currency.code,
        travelers: trip.travelers,
        expenses: trip.expenses,
      });

      // Refresh the limit count before navigating
      await refresh();

      // Redirect to the saved trip page
      router.push(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save trip");
      setSaving(false);
    }
  };

  return (
    <>
      <Card className="bg-gold/5 border-gold/20 p-6 md:p-7">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1 min-w-0">
            <Typography variant="h3" className="text-gold mb-2 font-bold flex items-center gap-2">
              <span>💾</span> Save this trip
            </Typography>
            <Typography variant="small" className="opacity-60 leading-relaxed">
              Get a clean link like{" "}
              <span className="font-mono text-text-muted bg-white/5 px-1.5 py-0.5 rounded-md text-[11px]">
                {getCleanBaseUrl()}/t/bali-2026
              </span>{" "}
              and access this trip anytime.
            </Typography>

            {error && (
              <Typography variant="small" className="text-red-400 mt-3 flex items-center gap-2">
                <span>⚠️</span> {error}
              </Typography>
            )}

            {user && isFull && (
              <Typography variant="small" className="text-red-400 mt-3 flex items-center gap-2">
                <span>⚠️</span> You've reached your limit of {limit} trips.
              </Typography>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 w-full md:w-auto">
            <Button
              onClick={handleSave}
              disabled={saving || (!!user && isFull)}
              size="md"
              className="w-full md:w-auto min-w-[180px]"
            >
              {saving ? (
                <>
                  <span className="animate-spin mr-2">🌀</span> Saving...
                </>
              ) : user ? (
                isFull ? "Limit Reached" : "Save trip →"
              ) : (
                "Sign in to save →"
              )}
            </Button>
            {user && (
              <Typography variant="small" className={`font-mono font-bold text-[10px] ${isFull ? "text-red-400" : "text-gold/50"}`}>
                {count}/{limit} trips used
              </Typography>
            )}
          </div>
        </div>
      </Card>

      {showSignIn && <SignInModal onClose={() => setShowSignIn(false)} reason="save" />}
    </>
  );
}
