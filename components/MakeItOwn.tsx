"use client";

import { useState } from "react";
import { useTrip } from "@/lib/trip-context";
import { MAX_TRAVELER_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import TravelerExpenseModal from "@/components/TravelerExpenseModal";

export default function MakeItOwn() {
  const { trip, isSharedView, isReadOnly, hasBeenModified, setStep, makeItOwn } = useTrip();
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [pendingName, setPendingName] = useState<string | null>(null);

  // Visibility is controlled by the parent (Settlement), but we double check here
  if (!isSharedView || isReadOnly || hasBeenModified) return null;

  const handleMakeOwn = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    const exists = trip.travelers.some(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (!exists && trip.expenses.length > 0) {
      setPendingName(trimmed);
    } else {
      makeItOwn(trimmed);
      setShowForm(false);
      setNewName("");
      setStep("setup");
    }
  };

  const confirmAdd = (expenseIds: string[]) => {
    if (pendingName) {
      makeItOwn(pendingName, expenseIds);
      setPendingName(null);
      setShowForm(false);
      setNewName("");
      setStep("setup");
    }
  };

  if (!showForm) {
    return (
      <Button
        variant="secondary"
        className="w-full mt-4 border-gold/30 text-gold"
        onClick={() => setShowForm(true)}
      >
        ✨ Make this trip my own
      </Button>
    );
  }

  return (
    <Card className="mt-4 p-6 border-gold/50 bg-gold/5 animate-fade-up">
      {pendingName && (
        <TravelerExpenseModal
          travelerName={pendingName}
          expenses={trip.expenses}
          onConfirm={confirmAdd}
          onCancel={() => setPendingName(null)}
        />
      )}
      <Typography variant="h3" className="text-gold mb-2">
        Make it your own
      </Typography>
      <Typography variant="small" className="opacity-60 mb-4 block">
        You will become the new owner of this trip. The current owner will remain as a regular traveler.
      </Typography>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <input
            className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 pr-14 text-[15px] text-text outline-none focus:border-gold/50 focus:bg-white/12 transition-all"
            placeholder="Enter your name..."
            value={newName}
            maxLength={MAX_TRAVELER_NAME}
            onChange={(e) => setNewName(e.target.value.replace(/[0-9]/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && handleMakeOwn()}
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <Typography variant="small" className="text-[10px] opacity-30">
              {newName.length}/{MAX_TRAVELER_NAME}
            </Typography>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1" onClick={handleMakeOwn} disabled={!newName.trim()}>
            Confirm
          </Button>
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
}
