import { getCleanBaseUrl } from "@/lib/utils";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "TripSplit — Split travel expenses with friends. No login needed.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: i % 4 === 0 ? 4 : 2,
              height: i % 4 === 0 ? 4 : 2,
              borderRadius: "50%",
              background: `rgba(255,255,255,${0.3 + (i % 4) * 0.15})`,
              top: `${(i * 37 + 11) % 90}%`,
              left: `${(i * 61 + 7) % 90}%`,
              display: "flex",
            }}
          />
        ))}

        {/* Card */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 32,
            padding: "56px 80px",
            gap: 24,
          }}
        >
          <div style={{ fontSize: 72, display: "flex" }}>✈️</div>

          <div
            style={{
              fontSize: 80,
              fontWeight: 700,
              background: "linear-gradient(135deg, #ffd200, #f7971e)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
              letterSpacing: "-1px",
            }}
          >
            TripSplit
          </div>

          <div
            style={{
              fontSize: 28,
              color: "rgba(240,235,227,0.65)",
              display: "flex",
              textAlign: "center",
              maxWidth: 600,
              lineHeight: 1.4,
            }}
          >
            Split travel expenses with friends. No login needed.
          </div>

          <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
            {["✓ No login", "✓ No app", "✓ Free"].map((badge) => (
              <div
                key={badge}
                style={{
                  display: "flex",
                  background: "rgba(255,210,0,0.12)",
                  border: "1px solid rgba(255,210,0,0.25)",
                  borderRadius: 20,
                  padding: "8px 20px",
                  fontSize: 20,
                  color: "#ffd200",
                  fontWeight: 700,
                }}
              >
                {badge}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 28,
            fontSize: 20,
            color: "rgba(240,235,227,0.25)",
            display: "flex",
            fontFamily: "monospace",
          }}
        >
          { getCleanBaseUrl() }
        </div>
      </div>
    ),
    { ...size }
  );
}
