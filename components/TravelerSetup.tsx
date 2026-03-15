"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { saveTrip } from "@/lib/api";
import { useTrip } from "@/lib/trip-context";
import { CURRENCIES, MAX_TRAVELERS, MAX_TRAVELER_NAME, MAX_TRIP_NAME } from "@/lib/constants";
import { avatarColor, getInitial } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import TravelerExpenseModal from "@/components/TravelerExpenseModal";

export default function TravelerSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const { trip, updateTripName, updateOwnerName, updateCurrency, addTraveler, removeTraveler, setStep, isReadOnly } =
    useTrip();
  const [newName, setNewName] = useState("");
  const [pendingName, setPendingName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    const trimmed = newName.trim();
    if (!trimmed || trip.travelers.length >= MAX_TRAVELERS) return;

    // Prevent duplicates
    const isDuplicate = trip.travelers.some(
      (t) => t.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      alert("This traveler is already added.");
      return;
    }

    if (trip.expenses.length > 0) {
      setPendingName(trimmed);
    } else {
      addTraveler(trimmed);
      setNewName("");
    }
  };

  const confirmAdd = (expenseIds: string[]) => {
    if (pendingName) {
      addTraveler(pendingName, expenseIds);
      setPendingName(null);
      setNewName("");
    }
  };

  const canContinue = trip.name.trim().length > 0 && (trip.ownerName?.trim().length ?? 0) > 0 && trip.travelers.length >= 2;

  const handleContinue = () => {
    if (!canContinue) return;
    setStep("expenses");
  };

  return (
    <div className="animate-fade-up flex flex-col gap-5">
      {pendingName && (
        <TravelerExpenseModal
          travelerName={pendingName}
          expenses={trip.expenses}
          onConfirm={confirmAdd}
          onCancel={() => setPendingName(null)}
        />
      )}
      {/* Trip name */}
      <Card className="p-7 md:p-8 border-white/5 bg-white/[0.02]">
        <Typography variant="h3" className="mb-6 text-white">Start a New Trip</Typography>

        <div className="bg-brand/10 border border-brand/20 rounded-xl px-4 py-3 mb-8 flex gap-3">
          <span className="text-brand">ℹ️</span>
          <p className="text-[12px] text-brand-light font-bold leading-tight">
            No account needed. Just create and share.
          </p>
        </div>

        <div className="flex justify-between items-center mb-2">
          <Typography variant="sub" className="text-text-muted">
            Trip Name
          </Typography>
          <Typography variant="small" className="text-[10px] opacity-30">
            {trip.name.length}/{MAX_TRIP_NAME}
          </Typography>
        </div>
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-text outline-none focus:border-brand/50 focus:bg-white/8 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          placeholder="e.g. Summer in Tokyo"
          value={trip.name}
          maxLength={MAX_TRIP_NAME}
          onChange={(e) => updateTripName(e.target.value)}
          disabled={isReadOnly}
        />

        <div className="flex justify-between items-center mb-2">
          <Typography variant="sub" className="text-text-muted">
            Owner's Name
          </Typography>
          <Typography variant="small" className="text-[10px] opacity-30">
            {(trip.ownerName ?? "").length}/{MAX_TRAVELER_NAME}
          </Typography>
        </div>
        <input
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-text outline-none focus:border-brand/50 focus:bg-white/8 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          placeholder="e.g. John"
          value={trip.ownerName ?? ""}
          maxLength={MAX_TRAVELER_NAME}
          onChange={(e) => updateOwnerName(e.target.value.replace(/[0-9]/g, ""))}
          disabled={isReadOnly}
        />

        <Typography variant="sub" className="text-text-muted mb-2 block">
          Currency
        </Typography>
        <select
          value={trip.currency.code}
          onChange={(e) => {
            const c = CURRENCIES.find(curr => curr.code === e.target.value);
            if (c) updateCurrency(c);
          }}
          disabled={isReadOnly}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-[15px] text-text outline-none focus:border-brand/50 focus:bg-white/8 transition-all disabled:opacity-50 appearance-none cursor-pointer"
        >
          {CURRENCIES.map(c => (
            <option key={c.code} value={c.code} className="bg-bg-deep text-text">
              {c.code} ({c.symbol})
            </option>
          ))}
        </select>
      </Card>

      {/* Travelers */}
      <Card className="p-7 md:p-8 border-white/5 bg-white/[0.02]">
        <Typography variant="sub" className="text-text-muted mb-4 block">
          Travelers
        </Typography>
        <div className="flex flex-col gap-3 mb-6">
          {trip.travelers.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-4 py-3 animate-slide-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white"
                  style={{ background: i === 0 ? "var(--color-brand)" : "#475569" }}
                >
                  {getInitial(t.name)}
                </div>
                <Typography variant="body" className="font-bold text-[15px] text-white truncate max-w-[150px] sm:max-w-[250px]" title={t.name}>
                  {t.name} {i === 0 && <span className="text-[10px] text-brand-light ml-1 font-black uppercase">Owner</span>}
                </Typography>
              </div>
              {trip.travelers.length > 2 && i !== 0 && !isReadOnly && (
                <button
                  onClick={() => removeTraveler(t.id)}
                  className="w-6 h-6 flex items-center justify-center text-text-faint hover:text-red-400 transition-colors text-2xl cursor-pointer"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {!isReadOnly && (
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pr-14 text-[15px] text-text outline-none focus:border-brand/50 focus:bg-white/8 transition-all"
                placeholder={trip.travelers.length >= MAX_TRAVELERS ? "Limit reached" : "Add traveler name..."}
                value={newName}
                maxLength={MAX_TRAVELER_NAME}
                onChange={(e) => setNewName(e.target.value.replace(/[0-9]/g, ""))}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                disabled={trip.travelers.length >= MAX_TRAVELERS}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <Typography variant="small" className="text-[10px] opacity-30">
                  {newName.length}/{MAX_TRAVELER_NAME}
                </Typography>
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={handleAdd}
              disabled={trip.travelers.length >= MAX_TRAVELERS}
              className="w-full sm:w-auto"
            >
              + Add
            </Button>
          </div>
        )}
      </Card>

      <Button
        className="w-full mt-2"
        size="lg"
        disabled={!canContinue || loading}
        onClick={handleContinue}
      >
        {loading ? (
          <>
            <span className="animate-spin mr-2">🌀</span> Saving...
          </>
        ) : (
          "Create Trip & Get Link →"
        )}
      </Button>
    </div>
  );
}
