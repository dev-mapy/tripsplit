"use client";

import { useTrip } from "@/lib/trip-context";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

export default function OwnerHeaderCard() {
  const { trip, isSharedView, hasBeenModified, step } = useTrip();

  if (!trip.ownerName || step === "setup") return null;

  return (
    <Card className="mb-6 p-4 border-gold/30 bg-gold/5 flex items-center justify-between animate-fade-down">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-xl shadow-inner">
          👑
        </div>
        <div>
          <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold block leading-none mb-1">
            Trip Owner
          </Typography>
          <Typography variant="h3" className="text-gold font-bold leading-none">
            {trip.ownerName}
          </Typography>
        </div>
      </div>
      {trip.isEditable && isSharedView && !hasBeenModified && (
        <div className="hidden sm:block">
          <Typography variant="small" className="bg-gold/10 text-gold px-3 py-1 rounded-full border border-gold/20 font-bold text-[10px] uppercase tracking-tighter">
            Editable Link
          </Typography>
        </div>
      )}
    </Card>
  );
}
