"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { deleteTrip } from "@/lib/api";
import styles from "./DashboardView.module.css";

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
    <main
      style={{
        minHeight: "100vh",
        padding: "0 0 80px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Stars background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {Array.from({ length: 30 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 5 === 0 ? 3 : 2,
              height: i % 5 === 0 ? 3 : 2,
              borderRadius: "50%",
              background: `rgba(255,255,255,${0.2 + (i % 5) * 0.1})`,
              top: `${(i * 37) % 100}%`,
              left: `${(i * 61) % 100}%`,
              animation: `twinkle ${2 + (i % 3)}s ease-in-out infinite`,
              animationDelay: `${(i % 4) * 0.7}s`,
            }}
          />
        ))}
      </div>

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 720,
          margin: "0 auto",
          padding: "40px 20px 0",
        }}
      >
        {/* Header */}
        <div className={styles.header}>
          <Link href="/split" className={styles.logo}>
            ✈️ TripSplit
          </Link>

          <div className={styles.userSection}>
            <div className={styles.userInfo}>
              {userAvatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={userAvatar}
                  alt="avatar"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #f7971e, #ffd200)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#1a1a2e",
                  }}
                >
                  {firstName[0].toUpperCase()}
                </div>
              )}
              <span className={styles.userName}>{firstName}</span>
            </div>

            <button
              onClick={async () => {
                await signOut();
                router.push("/home");
              }}
              className={styles.signOutButton}
            >
              Sign out
            </button>
          </div>
        </div>

        {/* Page title */}
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 5vw, 40px)",
              fontWeight: 700,
              margin: "0 0 8px",
            }}
          >
            Your Trips
          </h1>
          <p
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 15,
              color: "rgba(240,235,227,0.45)",
              margin: 0,
            }}
          >
            {trips.length === 0
              ? "No saved trips yet."
              : `${trips.length} saved trip${trips.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {/* New trip CTA */}
        <div className="animate-fade-up" style={{ marginBottom: 32 }}>
          <Link
            href="/split"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg, #f7971e, #ffd200)",
              color: "#1a1a2e",
              borderRadius: 12,
              padding: "12px 24px",
              fontFamily: "'Lato', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
            }}
          >
            + New Trip
          </Link>
        </div>

        {/* Empty state */}
        {trips.length === 0 && (
          <div
            className="animate-fade-up"
            style={{
              textAlign: "center",
              padding: "80px 24px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
            }}
          >
            <div style={{ fontSize: 56, marginBottom: 20 }}>🧳</div>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 24,
                marginBottom: 12,
              }}
            >
              No trips yet
            </h2>
            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 15,
                color: "rgba(240,235,227,0.45)",
                marginBottom: 28,
                lineHeight: 1.7,
                maxWidth: 320,
                margin: "0 auto 28px",
              }}
            >
              Create your first trip, add expenses, and save it to get a
              clean shareable link.
            </p>
            <Link
              href="/split"
              style={{
                display: "inline-block",
                background: "linear-gradient(135deg, #f7971e, #ffd200)",
                color: "#1a1a2e",
                borderRadius: 12,
                padding: "14px 32px",
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                fontFamily: "'Lato', sans-serif",
              }}
            >
              Create your first trip ✈️
            </Link>
          </div>
        )}

        {/* Trip cards */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          {trips.map((trip, i) => (
            <div
              key={trip.id}
              className="animate-fade-up"
              style={{
                background: "rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 18,
                padding: "20px 24px",
                animationDelay: `${i * 0.07}s`,
                position: "relative",
              }}
            >
              {/* Delete confirm overlay */}
              {confirmSlug === trip.slug && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(20,18,48,0.95)",
                    borderRadius: 18,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 16,
                    zIndex: 10,
                    padding: 24,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 18,
                      textAlign: "center",
                    }}
                  >
                    Delete &ldquo;{trip.name}&rdquo;?
                  </div>
                  <div
                    style={{
                      fontFamily: "'Lato', sans-serif",
                      fontSize: 13,
                      color: "rgba(240,235,227,0.45)",
                      textAlign: "center",
                    }}
                  >
                    This cannot be undone. The link will stop working.
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => setConfirmSlug(null)}
                      style={{
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        borderRadius: 10,
                        padding: "10px 20px",
                        fontFamily: "'Lato', sans-serif",
                        fontSize: 14,
                        color: "rgba(240,235,227,0.7)",
                        cursor: "pointer",
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(trip.slug)}
                      disabled={deletingSlug === trip.slug}
                      style={{
                        background: "rgba(248,113,113,0.2)",
                        border: "1px solid rgba(248,113,113,0.4)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        borderRadius: 10,
                        padding: "10px 20px",
                        fontFamily: "'Lato', sans-serif",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#f87171",
                        cursor: "pointer",
                        opacity: deletingSlug === trip.slug ? 0.6 : 1,
                      }}
                    >
                        {deletingSlug === trip.slug ? (
                          <>
                            <span className="animate-spin">🌀</span> Deleting...
                          </>
                        ) : (
                          "Yes, delete"
                        )}
                    </button>
                  </div>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                {/* Trip info */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <Link
                    href={`/t/${trip.slug}`}
                    style={{ textDecoration: "none" }}
                  >
                    <h2
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 20,
                        fontWeight: 700,
                        margin: "0 0 6px",
                        color: "#f0ebe3",
                        transition: "color 0.15s",
                      }}
                    >
                      {trip.name}
                    </h2>
                  </Link>

                  {/* Meta row */}
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px 16px",
                      fontFamily: "'Lato', sans-serif",
                      fontSize: 13,
                      color: "rgba(240,235,227,0.45)",
                      marginBottom: 12,
                    }}
                  >
                    <span>
                      {trip.currencyFlag} {trip.currencyCode}
                    </span>
                    <span>👥 {trip.travelerCount} travelers</span>
                    <span>🧾 {trip.expenseCount} expenses</span>
                    <span>📅 {formatDate(trip.createdAt)}</span>
                  </div>

                  {/* Slug link */}
                  <div
                    style={{
                      fontFamily: "monospace",
                      fontSize: 12,
                      color: "rgba(240,235,227,0.3)",
                    }}
                  >
                    tripsplit.app/t/{trip.slug}
                  </div>
                </div>

                {/* Total + actions */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 12,
                    flexShrink: 0,
                  }}
                >
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontFamily: "'Lato', sans-serif",
                        fontSize: 11,
                        textTransform: "uppercase",
                        letterSpacing: "1px",
                        color: "rgba(240,235,227,0.35)",
                        marginBottom: 2,
                      }}
                    >
                      Total
                    </div>
                    <div
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: 26,
                        fontWeight: 700,
                        color: "#ffd200",
                      }}
                    >
                      {trip.currencySymbol}
                      {trip.total.toFixed(2)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 8 }}>
                    <Link
                      href={`/t/${trip.slug}`}
                      style={{
                        background: "rgba(255,210,0,0.15)",
                        border: "1px solid rgba(255,210,0,0.25)",
                        borderRadius: 8,
                        padding: "7px 14px",
                        fontFamily: "'Lato', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#ffd200",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      View →
                    </Link>
                    <button
                      onClick={() => setConfirmSlug(trip.slug)}
                      style={{
                        background: "rgba(248,113,113,0.08)",
                        border: "1px solid rgba(248,113,113,0.2)",
                        borderRadius: 8,
                        padding: "7px 12px",
                        fontFamily: "'Lato', sans-serif",
                        fontSize: 13,
                        color: "rgba(248,113,113,0.6)",
                        cursor: "pointer",
                      }}
                    >
                      🗑
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
