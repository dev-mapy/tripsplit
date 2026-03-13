"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { saveTrip } from "@/lib/api";
import { useTrip } from "@/lib/trip-context";
import { CURRENCIES, MAX_TRAVELERS } from "@/lib/constants";
import { avatarColor, getInitial } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

export default function TravelerSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const { trip, updateTripName, updateCurrency, addTraveler, removeTraveler, setStep } =
    useTrip();
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = () => {
    if (!newName.trim() || trip.travelers.length >= MAX_TRAVELERS) return;
    addTraveler(newName.trim());
    setNewName("");
  };

  const canContinue = trip.name.trim().length > 0 && trip.travelers.length >= 2;

  const handleContinue = () => {
    if (!canContinue) return;
    setStep("expenses");
  };

  return (
    <div className="animate-fade-up flex flex-col gap-5">
      {/* Trip name */}
      <Card className="p-7 md:p-8">
        <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-3 block">
          Trip Name
        </Typography>
        <input
          className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-[15px] text-text outline-none focus:border-gold/50 focus:bg-white/12 transition-all"
          placeholder="e.g. Bali Summer 2026 🌴"
          value={trip.name}
          onChange={(e) => updateTripName(e.target.value)}
        />

        <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-3 mt-8 block">
          Currency
        </Typography>
        <div className="flex flex-wrap gap-2">
          {CURRENCIES.map((c) => {
            const active = trip.currency.code === c.code;
            return (
              <button
                key={c.code}
                onClick={() => updateCurrency(c)}
                className={`
                  px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer
                  ${active
                    ? "bg-gold/15 border border-gold text-gold"
                    : "bg-white/8 border border-white/12 text-text opacity-70 hover:opacity-100 hover:bg-white/12"}
                `}
              >
                {c.flag} {c.code}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Travelers */}
      <Card className="p-7 md:p-8">
        <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-4 block">
          Travelers
        </Typography>
        <div className="flex flex-col gap-3 mb-5">
          {trip.travelers.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 animate-slide-in"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
                  style={{ background: avatarColor(i) }}
                >
                  {getInitial(t.name)}
                </div>
                <Typography variant="body" className="font-medium">{t.name}</Typography>
              </div>
              {trip.travelers.length > 2 && (
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

        <div className="flex gap-2">
          <input
            className="flex-1 bg-white/8 border border-white/15 rounded-xl px-4 py-3 text-[15px] text-text outline-none focus:border-gold/50 focus:bg-white/12 transition-all"
            placeholder={trip.travelers.length >= MAX_TRAVELERS ? "Limit reached" : "Add traveler name..."}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            disabled={trip.travelers.length >= MAX_TRAVELERS}
          />
          <Button variant="secondary" onClick={handleAdd} disabled={trip.travelers.length >= MAX_TRAVELERS}>
            + Add
          </Button>
        </div>
        {trip.travelers.length >= MAX_TRAVELERS && (
          <Typography variant="small" className="text-red-400/60 text-[11px] mt-2 block">
            Maximum of {MAX_TRAVELERS} travelers reached.
          </Typography>
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
          "Continue to Expenses →"
        )}
      </Button>
    </div>
  );
}
