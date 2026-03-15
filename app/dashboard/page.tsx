import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { CURRENCIES } from "@/lib/constants";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import type { Traveler, Expense } from "@/types";
import DashboardView from "./DashboardView";

export const metadata: Metadata = {
  title: "My Trips | TripSplit",
  description: "All your saved trips in one place.",
};

export default async function DashboardPage() {
  // Server-side auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/home?signin=required");
  }

  // Fetch all trips for this user
  const rawTrips = await prisma.savedTrip.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  // Shape trips for the client
  const trips = rawTrips.map((t: any) => {
    const expenses = t.expenses as unknown as Expense[];
    const travelers = t.travelers as unknown as Traveler[];
    const currency =
      CURRENCIES.find((c) => c.code === t.currencyCode) ?? DEFAULT_CURRENCY;
    const total = expenses.reduce((s, e) => s + e.amount, 0);

    return {
      id: t.id,
      slug: t.slug,
      name: t.name,
      currencyCode: t.currencyCode,
      currencySymbol: currency.symbol,
      currencyFlag: currency.flag,
      travelerCount: travelers.length,
      expenseCount: expenses.length,
      total,
      createdAt: t.createdAt.toISOString(),
      updatedAt: t.updatedAt.toISOString(),
    };
  });

  return (
    <DashboardView
      userName={user.user_metadata?.full_name ?? user.email ?? "Traveler"}
      userAvatar={user.user_metadata?.avatar_url ?? null}
      trips={trips}
    />
  );
}
