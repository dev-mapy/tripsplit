"use client";

import { useTrip } from "@/lib/trip-context";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";

export default function OwnerHeaderCard() {
  const { trip, isSharedView, hasBeenModified, step } = useTrip();

  if (!trip.ownerName || step === "setup") return null;

  return (
    <Card className="mb-6 p-4 border-brand/20 bg-brand/5 animate-fade-down rounded-2xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-xl shadow-inner">
            👑
          </div>
          <div>
            <Typography variant="sub" className="text-text-faint leading-none mb-1">
              Trip Owner
            </Typography>
            <Typography variant="h3" className="text-brand-light font-black leading-none text-[18px]">
              {trip.ownerName}
            </Typography>
          </div>
        </div>

        {trip.isEditable && isSharedView && !hasBeenModified && (
          <div className="hidden sm:block">
            <Typography variant="small" className="bg-brand/10 text-brand-light px-3 py-1 rounded-full border border-brand/20 font-black text-[10px] uppercase tracking-widest">
              Editable Link
            </Typography>
          </div>
        )}
      </div>

      {trip.isEditable && isSharedView && !hasBeenModified && (
        <div className="sm:hidden mt-3 pl-13">
          <Typography variant="small" className="bg-brand/10 text-brand-light px-3 py-1 rounded-full border border-brand/20 font-black text-[10px] uppercase tracking-widest inline-block">
            Editable Link
          </Typography>
        </div>
      )}
    </Card>
  );
}
