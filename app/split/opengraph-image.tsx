import { getCleanBaseUrl } from "@/lib/utils";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TripSplit — Calculate who owes what on your trip.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function SplitOGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
          fontFamily: "serif",
          gap: 60,
          padding: "0 80px",
        }}
      >
        {/* Left: branding */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>
          <div style={{ fontSize: 48, display: "flex" }}>✈️</div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              background: "linear-gradient(135deg, #ffd200, #f7971e)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            TripSplit
          </div>
          <div
            style={{
              fontSize: 24,
              color: "rgba(240,235,227,0.55)",
              display: "flex",
              lineHeight: 1.5,
              maxWidth: 360,
            }}
          >
            Who owes what? Find out in seconds.
          </div>
        </div>

        {/* Right: mock settlement card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            padding: "32px 36px",
            minWidth: 380,
          }}
        >
          <div
            style={{
              fontSize: 14,
              color: "rgba(240,235,227,0.4)",
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "flex",
              marginBottom: 8,
            }}
          >
            💸 Settlement Plan
          </div>

          {[
            { from: "Bob", to: "Ana", amount: "$45.00" },
            { from: "Carlos", to: "Ana", amount: "$30.00" },
          ].map((tx) => (
            <div
              key={tx.from}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "rgba(255,210,0,0.08)",
                border: "1px solid rgba(255,210,0,0.2)",
                borderRadius: 12,
                padding: "14px 18px",
              }}
            >
              <div style={{ display: "flex", gap: 8, fontSize: 20 }}>
                <span style={{ color: "#f87171", fontWeight: 700 }}>{tx.from}</span>
                <span style={{ color: "rgba(240,235,227,0.4)" }}>→</span>
                <span style={{ color: "#4ade80", fontWeight: 700 }}>{tx.to}</span>
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#ffd200", display: "flex" }}>
                {tx.amount}
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              fontSize: 14,
              color: "rgba(240,235,227,0.3)",
              marginTop: 4,
              fontFamily: "monospace",
            }}
          >
            { getCleanBaseUrl() }/split
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
