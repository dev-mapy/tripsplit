import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CURRENCIES } from "@/lib/constants";
import { DEFAULT_CURRENCY } from "@/lib/constants";
import type { Metadata } from "next";
import type { Traveler, Expense } from "@/types";
import { getBaseUrl } from "@/lib/utils";
import SavedTripView from "./SavedTripView";

interface Props {
  params: Promise<{ slug: string }>;
}

// Fetch trip server-side
async function getTrip(slug: string) {
  try {
    const trip = await prisma.savedTrip.findUnique({
      where: { slug },
    });
    return trip;
  } catch (error) {
    console.error("Error fetching trip:", error);
    return null;
  }
}

// Dynamic OG meta tags
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const trip = await getTrip(slug);

  if (!trip) {
    return { title: "Trip not found | TripSplit" };
  }

  const expenses = (trip.expenses as unknown) as Expense[];
  const total = expenses.reduce((s, e) => s + e.amount, 0).toFixed(2);
  const travelers = (trip.travelers as unknown) as Traveler[];
  const currency =
    CURRENCIES.find((c) => c.code === trip.currencyCode) ?? DEFAULT_CURRENCY;

  const ogImageUrl = new URL(
    `/api/og?name=${encodeURIComponent(trip.name)}&total=${total}&symbol=${encodeURIComponent(currency.symbol)}&travelers=${travelers.length}&expenses=${expenses.length}`,
    getBaseUrl()
  ).toString();

  return {
    title: `${trip.name} — TripSplit`,
    description: `${travelers.length} travelers · ${expenses.length} expenses · ${currency.symbol}${total} total. See who owes what.`,
    openGraph: {
      title: `${trip.name} — TripSplit`,
      description: `See who owes what for ${trip.name}. ${travelers.length} travelers · ${currency.symbol}${total} total spent.`,
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${trip.name} — TripSplit`,
      images: [ogImageUrl],
    },
  };
}

export default async function TripPage({ params }: Props) {
  const { slug } = await params;
  let trip = await getTrip(slug);

  // Fallback for development/previews if slug is "demo"
  if (!trip && (slug === "demo" || slug === "europe-2024")) {
    trip = {
      id: "demo-id",
      slug,
      userId: "demo-user",
      name: slug === "demo" ? "Demo Trip" : "Europe Summer 2024",
      currencyCode: "EUR",
      travelers: [
        { id: "1", name: "Alice" },
        { id: "2", name: "Bob" },
        { id: "3", name: "Charlie" },
      ] as any,
      expenses: [
        {
          id: "e1",
          desc: "Dinner",
          amount: 120,
          category: "🍴 Food",
          paidBy: "1",
          splitAmong: ["1", "2", "3"],
          date: new Date().toISOString(),
        },
      ] as any,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any;
  }

  if (!trip) {
    notFound();
  }

  const currency =
    CURRENCIES.find((c) => c.code === trip.currencyCode) ?? DEFAULT_CURRENCY;

  return (
    <SavedTripView
      tripId={trip.id}
      slug={trip.slug}
      userId={trip.userId}
      name={trip.name}
      currency={currency}
      travelers={(trip.travelers as unknown) as Traveler[]}
      expenses={(trip.expenses as unknown) as Expense[]}
      createdAt={trip.createdAt.toISOString()}
      updatedAt={trip.updatedAt.toISOString()}
    />
  );
}
