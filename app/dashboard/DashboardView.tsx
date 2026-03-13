"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useTripLimit } from "@/lib/trip-limit-context";
import { deleteTrip } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import { StarsBackground } from "@/components/ui/StarsBackground";
import { Layout } from "@/components/ui/Layout";
import { UserNav } from "@/components/UserNav";

interface TripSummary {
  id: string;
  slug: string;
  name: string;
  currencyCode: string;
  currencySymbol: string;
  currencyFlag: string;
  travelerCount: number;
  expenseCount: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

interface Props {
  userName: string;
  userAvatar: string | null;
  trips: TripSummary[];
}

export default function DashboardView({
  userName,
  userAvatar,
  trips: initialTrips,
}: Props) {
  const { signOut } = useAuth();
  const { count, limit, isFull, refresh: refreshLimit } = useTripLimit();
  const router = useRouter();
  const [trips, setTrips] = useState<TripSummary[]>(initialTrips);
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null);
  const [confirmSlug, setConfirmSlug] = useState<string | null>(null);

  const firstName = userName.split(" ")[0];

  const handleDelete = async (slug: string) => {
    setDeletingSlug(slug);
    try {
      await deleteTrip(slug);
      setTrips((prev) => prev.filter((t) => t.slug !== slug));
      setConfirmSlug(null);
      refreshLimit();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setDeletingSlug(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <Layout variant="centered">
      <StarsBackground count={40} />

      <div className="flex items-center justify-between mb-12">
        <Link href="/split" className="text-xl font-serif font-bold text-gold hover:opacity-80 transition-opacity">
          ✈️ TripSplit
        </Link>
        <UserNav
          userName={userName}
          userAvatar={userAvatar}
          onSignOut={async () => {
            await signOut();
            router.push("/home");
          }}
        />
      </div>

      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Typography variant="h1" className="mb-2">Your Trips</Typography>
          <Typography variant="body" className="opacity-50">
            {trips.length === 0
              ? "No saved trips yet."
              : `${trips.length} saved trip${trips.length !== 1 ? "s" : ""}`}
          </Typography>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
            <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${isFull ? "bg-red-400" : "bg-gold"}`}
                style={{ width: `${Math.min(100, (count / limit) * 100)}%` }}
              />
            </div>
            <Typography variant="small" className={`font-mono font-bold ${isFull ? "text-red-400" : "text-gold"}`}>
              {count}/{limit}
            </Typography>
          </div>

          <Button href="/split" size="lg" disabled={isFull}>
            {isFull ? "Limit Reached" : "+ New Trip"}
          </Button>

          {isFull && (
            <Typography variant="small" className="text-red-400/60 text-[11px] max-w-[200px] text-right">
              You've reached the free limit of {limit} trips. Delete one to create more.
            </Typography>
          )}
        </div>
      </div>

      {trips.length === 0 ? (
        <Card className="text-center py-20 px-8">
          <div className="text-6xl mb-6">🧳</div>
          <Typography variant="h2" className="mb-4">No trips yet</Typography>
          <Typography variant="body" className="opacity-60 mb-8 max-w-sm mx-auto">
            Create your first trip, add expenses, and save it to get a
            clean shareable link.
          </Typography>
          <Button href="/split" variant="primary" size="lg">
            Create your first trip ✈️
          </Button>
        </Card>
      ) : (
        <div className="flex flex-col gap-6">
          {trips.map((trip, i) => (
            <Card
              key={trip.id}
              className="p-0 overflow-hidden relative group animate-fade-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {confirmSlug === trip.slug && (
                <div className="absolute inset-0 z-20 bg-bg-deep/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-200">
                  <Typography variant="h3" className="mb-2">Delete "{trip.name}"?</Typography>
                  <Typography variant="small" className="opacity-60 mb-6">
                    This cannot be undone. The link will stop working.
                  </Typography>
                  <div className="flex gap-3">
                    <Button variant="secondary" onClick={() => setConfirmSlug(null)}>
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => handleDelete(trip.slug)}
                      disabled={deletingSlug === trip.slug}
                    >
                      {deletingSlug === trip.slug ? "Deleting..." : "Yes, delete"}
                    </Button>
                  </div>
                </div>
              )}

              <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                <div className="flex-1 min-w-0">
                  <Link href={`/t/${trip.slug}`} className="block group/title">
                    <Typography variant="h2" className="mb-2 group-hover/title:text-gold transition-colors truncate">
                      {trip.name}
                    </Typography>
                  </Link>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                    <Typography variant="small" className="flex items-center gap-1.5 opacity-50">
                      <span>{trip.currencyFlag}</span> {trip.currencyCode}
                    </Typography>
                    <Typography variant="small" className="flex items-center gap-1.5 opacity-50">
                      <span>👥</span> {trip.travelerCount} travelers
                    </Typography>
                    <Typography variant="small" className="flex items-center gap-1.5 opacity-50">
                      <span>🧾</span> {trip.expenseCount} expenses
                    </Typography>
                    <Typography variant="small" className="flex items-center gap-1.5 opacity-50">
                      <span>📅</span> {formatDate(trip.createdAt)}
                    </Typography>
                  </div>

                  <div className="font-mono text-[11px] opacity-30 truncate">
                    tripsplit.app/t/{trip.slug}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-end justify-between md:justify-start gap-4 flex-shrink-0">
                  <div className="text-right">
                    <Typography variant="small" className="uppercase tracking-widest opacity-40 font-bold mb-1">
                      Total
                    </Typography>
                    <Typography variant="h2" className="text-gold">
                      {trip.currencySymbol}{trip.total.toFixed(2)}
                    </Typography>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={`/t/${trip.slug}`}>View →</Link>
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      className="w-10 h-10 p-0"
                      onClick={() => setConfirmSlug(trip.slug)}
                      aria-label="Delete trip"
                    >
                      🗑
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Layout>
  );
}
