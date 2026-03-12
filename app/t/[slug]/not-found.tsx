import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trip not found | TripSplit",
};

export default function TripNotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 64, marginBottom: 24 }}>✈️</div>
      <h1
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 32,
          marginBottom: 12,
          color: "var(--gold)",
        }}
      >
        Trip not found
      </h1>
      <p
        style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: 16,
          color: "rgba(240,235,227,0.5)",
          marginBottom: 32,
          maxWidth: 360,
          lineHeight: 1.7,
        }}
      >
        This trip link may have been deleted or the URL might be incorrect.
      </p>
      <Link
        href="/split"
        style={{
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
        Start a new trip ✈️
      </Link>
    </main>
  );
}
