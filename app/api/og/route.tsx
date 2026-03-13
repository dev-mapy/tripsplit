import { getCleanBaseUrl } from "@/lib/utils";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const name = searchParams.get("name") || "Our Trip";
    const total = searchParams.get("total") || "0.00";
    const symbol = searchParams.get("symbol") || "$";
    const travelers = searchParams.get("travelers") || "0";
    const expenses = searchParams.get("expenses") || "0";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
            position: "relative",
            fontFamily: "sans-serif",
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

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 32,
              padding: "40px 60px",
              gap: 20,
              maxWidth: "80%",
            }}
          >
            <div style={{ fontSize: 48, display: "flex" }}>✈️</div>

            <div
              style={{
                fontSize: 64,
                fontWeight: 700,
                background: "linear-gradient(135deg, #ffd200, #f7971e)",
                backgroundClip: "text",
                color: "transparent",
                display: "flex",
                textAlign: "center",
                lineHeight: 1.1,
              }}
            >
              {name}
            </div>

            <div
              style={{
                display: "flex",
                gap: 40,
                marginTop: 10,
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ color: "rgba(240,235,227,0.4)", fontSize: 18, textTransform: "uppercase", letterSpacing: 1 }}>Total Spent</div>
                <div style={{ color: "#ffd200", fontSize: 42, fontWeight: 700 }}>
                  {symbol}{total}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ color: "rgba(240,235,227,0.4)", fontSize: 18, textTransform: "uppercase", letterSpacing: 1 }}>Travelers</div>
                <div style={{ color: "#fff", fontSize: 42, fontWeight: 700 }}>{travelers}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ color: "rgba(240,235,227,0.4)", fontSize: 18, textTransform: "uppercase", letterSpacing: 1 }}>Expenses</div>
                <div style={{ color: "#fff", fontSize: 42, fontWeight: 700 }}>{expenses}</div>
              </div>
            </div>

            <div
              style={{
                marginTop: 20,
                fontSize: 20,
                color: "rgba(240,235,227,0.6)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span>Split fairly with</span>
              <span style={{ color: "#ffd200", fontWeight: 700 }}>TripSplit</span>
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
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
