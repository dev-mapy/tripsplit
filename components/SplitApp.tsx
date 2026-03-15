"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTrip } from "@/lib/trip-context";
import { saveTrip } from "@/lib/api";
import TravelerSetup from "@/components/TravelerSetup";
import ExpenseList from "@/components/ExpenseList";
import Settlement from "@/components/Settlement";
import { UserNav } from "@/components/UserNav";
import SaveNudge from "@/components/SaveNudge";
import { Layout } from "@/components/ui/Layout";
import { Typography } from "@/components/ui/Typography";
import { StarsBackground } from "@/components/ui/StarsBackground";
import OwnerHeaderCard from "@/components/OwnerHeaderCard";

const STEPS = ["setup", "expenses", "result"] as const;
const STEP_LABELS = ["Trip Setup", "Expenses", "Settlement"];

export default function SplitApp() {
  const { user } = useAuth();
  const router = useRouter();
  const { step } = useTrip();

  return (
    <Layout variant="centered">
      <StarsBackground count={40} />

      <div className="text-center mb-16 relative">
        <div className="absolute top-0 right-0 sm:-top-2">
          <UserNav />
        </div>

        <div className="text-6xl mb-4 animate-bounce-slow">✈️</div>
        <Typography variant="h1" className="text-[clamp(36px,8vw,56px)] bg-linear-to-br from-gold to-gold-warm bg-clip-text text-transparent mb-2">
          TripSplit
        </Typography>
        <Typography variant="body" className="opacity-50 text-[16px]">
          No login. No drama. Just fair splits.
        </Typography>
        <a
          href="/home"
          className="inline-block mt-4 text-[11px] font-bold text-text-faint hover:text-white uppercase tracking-widest no-underline transition-colors"
        >
          ← About TripSplit
        </a>

        {/* Step indicator */}
        <div className="flex flex-col items-center gap-4 mt-12">
          <div className="flex items-center gap-8">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-8">
                <div
                  className={`
                    rounded-full transition-all duration-500
                    ${step === s ? "w-3 h-3 bg-gold shadow-[0_0_15px_rgba(247,151,30,0.6)]" :
                      STEPS.indexOf(step) > i ? "w-2.5 h-2.5 bg-gold/40" : "w-2 h-2 bg-white/10"}
                  `}
                />
                {i < 2 && <div className="w-10 h-px bg-white/5" />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-10 sm:gap-16 text-[10px] font-bold uppercase tracking-widest text-text-faint">
            {STEP_LABELS.map((l, i) => (
              <span
                key={l}
                className={STEPS[i] === step ? "text-gold" : ""}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10">
        <OwnerHeaderCard />
        {step === "setup" && (
          <div className="flex flex-col gap-4">
            <TravelerSetup />
            <SaveNudge />
          </div>
        )}
        {step === "expenses" && <ExpenseList />}
        {step === "result"   && <Settlement />}
      </div>
    </Layout>
  );
}
