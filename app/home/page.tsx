import Link from "next/link";
import type { Metadata } from "next";
import { getBaseUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "TripSplit — Split travel expenses with friends. No login needed.",
  description:
    "The easiest way to split trip expenses. Add your costs, share one link, and everyone sees exactly who owes what. No account needed.",
};

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", overflowX: "hidden" }}>
      <Stars />
      <Nav />
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  );
}

/* ── Stars Background ── */
function Stars() {
  const stars = Array.from({ length: 50 }, (_, i) => ({
    top: `${(i * 37 + 11) % 100}%`,
    left: `${(i * 61 + 7) % 100}%`,
    size: i % 7 === 0 ? 3 : i % 3 === 0 ? 2 : 1.5,
    opacity: 0.2 + (i % 5) * 0.1,
    duration: 2 + (i % 4),
    delay: (i % 5) * 0.6,
  }));

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: `rgba(255,255,255,${s.opacity})`,
            top: s.top,
            left: s.left,
            animation: `twinkle ${s.duration}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

/* ── Nav ── */
function Nav() {
  return (
    <nav
      style={{
        position: "relative",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "24px 40px",
        maxWidth: 1100,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22,
          fontWeight: 700,
          background: "linear-gradient(135deg, #ffd200, #f7971e)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ✈️ TripSplit
      </div>

      <Link
        href="/"
        style={{
          background: "linear-gradient(135deg, #f7971e, #ffd200)",
          color: "#1a1a2e",
          borderRadius: 10,
          padding: "10px 24px",
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
          fontFamily: "'Lato', sans-serif",
          letterSpacing: "0.3px",
          transition: "all 0.2s",
        }}
      >
        Try it free →
      </Link>
    </nav>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        padding: "80px 24px 100px",
        maxWidth: 780,
        margin: "0 auto",
      }}
    >
      {/* Eyebrow */}
      <div
        className="animate-fade-up"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          background: "rgba(255,210,0,0.1)",
          border: "1px solid rgba(255,210,0,0.25)",
          borderRadius: 20,
          padding: "6px 16px",
          fontSize: 13,
          color: "#ffd200",
          fontFamily: "'Lato', sans-serif",
          fontWeight: 700,
          letterSpacing: "0.5px",
          marginBottom: 32,
          textTransform: "uppercase",
        }}
      >
        <span>✦</span> No login. No app. No drama.
      </div>

      {/* Headline */}
      <h1
        className="animate-fade-up"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(40px, 7vw, 72px)",
          fontWeight: 700,
          lineHeight: 1.1,
          margin: "0 0 28px",
          animationDelay: "0.1s",
        }}
      >
        Split trip expenses
        <br />
        <span
          style={{
            background: "linear-gradient(135deg, #ffd200, #f7971e)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          with one link.
        </span>
      </h1>

      {/* Subheadline */}
      <p
        className="animate-fade-up"
        style={{
          fontFamily: "'Lato', sans-serif",
          fontSize: "clamp(16px, 2.5vw, 20px)",
          color: "rgba(240,235,227,0.6)",
          lineHeight: 1.7,
          margin: "0 auto 48px",
          maxWidth: 520,
          animationDelay: "0.2s",
        }}
      >
        Add your group&apos;s expenses, and TripSplit calculates exactly who
        owes what. Share one link — no account needed.
      </p>

      {/* CTA */}
      <div
        className="animate-fade-up"
        style={{
          display: "flex",
          gap: 14,
          justifyContent: "center",
          flexWrap: "wrap",
          animationDelay: "0.3s",
        }}
      >
        <Link
          href="/"
          style={{
            background: "linear-gradient(135deg, #f7971e, #ffd200)",
            color: "#1a1a2e",
            borderRadius: 14,
            padding: "16px 36px",
            fontWeight: 700,
            fontSize: 17,
            textDecoration: "none",
            fontFamily: "'Lato', sans-serif",
            letterSpacing: "0.3px",
            boxShadow: "0 8px 32px rgba(247,151,30,0.35)",
            transition: "all 0.2s",
          }}
        >
          Split a trip now ✈️
        </Link>
      </div>

      {/* Trust badges */}
      <div
        className="animate-fade-up"
        style={{
          display: "flex",
          gap: 24,
          justifyContent: "center",
          flexWrap: "wrap",
          marginTop: 36,
          animationDelay: "0.4s",
        }}
      >
        {[
          "✓ No login required",
          "✓ No app to download",
          "✓ Free to use",
        ].map((badge) => (
          <span
            key={badge}
            style={{
              fontFamily: "'Lato', sans-serif",
              fontSize: 14,
              color: "rgba(240,235,227,0.45)",
            }}
          >
            {badge}
          </span>
        ))}
      </div>

      {/* Floating preview card */}
      <div
        className="animate-fade-up"
        style={{
          marginTop: 72,
          animationDelay: "0.5s",
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 24,
          padding: "28px 32px",
          maxWidth: 480,
          margin: "72px auto 0",
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontFamily: "'Lato', sans-serif",
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "rgba(240,235,227,0.4)",
            marginBottom: 16,
          }}
        >
          💸 Settlement Plan
        </div>

        {[
          { from: "Bob", to: "Ana", amount: "$45.00" },
          { from: "Carlos", to: "Ana", amount: "$30.00" },
        ].map((tx, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "rgba(255,210,0,0.07)",
              border: "1px solid rgba(255,210,0,0.15)",
              borderRadius: 12,
              padding: "14px 18px",
              marginBottom: 10,
              fontFamily: "'Lato', sans-serif",
              fontSize: 15,
            }}
          >
            <div>
              <span style={{ fontWeight: 700, color: "#f87171" }}>
                {tx.from}
              </span>
              <span style={{ color: "rgba(240,235,227,0.4)", margin: "0 8px" }}>
                → pays →
              </span>
              <span style={{ fontWeight: 700, color: "#4ade80" }}>{tx.to}</span>
            </div>
            <div
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#ffd200",
              }}
            >
              {tx.amount}
            </div>
          </div>
        ))}

        <div
          style={{
            marginTop: 16,
            padding: "12px 16px",
            background: "rgba(255,210,0,0.06)",
            border: "1px solid rgba(255,210,0,0.15)",
            borderRadius: 10,
            fontSize: 13,
            fontFamily: "'Lato', sans-serif",
            color: "rgba(240,235,227,0.5)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ color: "#ffd200" }}>🔗</span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 12,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {getBaseUrl()}/?trip=QmFsaV8yMDI2...
          </span>
          <span
            style={{
              marginLeft: "auto",
              color: "#ffd200",
              fontWeight: 700,
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            Copy
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── How It Works ── */
function HowItWorks() {
  const steps = [
    {
      number: "01",
      emoji: "🧳",
      title: "Create your trip",
      desc: "Name your trip, pick your currency, and add everyone who's coming along.",
    },
    {
      number: "02",
      emoji: "🧾",
      title: "Log your expenses",
      desc: "Add each expense, who paid, and who it should be split among. TripSplit handles the math.",
    },
    {
      number: "03",
      emoji: "🔗",
      title: "Share one link",
      desc: "Your entire trip is encoded into a single URL. Share it and everyone sees exactly who owes what.",
    },
  ];

  return (
    <section
      style={{
        position: "relative",
        zIndex: 1,
        padding: "80px 24px 120px",
        maxWidth: 1000,
        margin: "0 auto",
      }}
    >
      {/* Section label */}
      <div style={{ textAlign: "center", marginBottom: 64 }}>
        <div
          className="animate-fade-up"
          style={{
            fontFamily: "'Lato', sans-serif",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            color: "rgba(240,235,227,0.4)",
            marginBottom: 16,
          }}
        >
          How it works
        </div>
        <h2
          className="animate-fade-up"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 700,
            margin: 0,
            animationDelay: "0.1s",
          }}
        >
          Three steps to a settled trip
        </h2>
      </div>

      {/* Steps */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 24,
        }}
      >
        {steps.map((step, i) => (
          <div
            key={step.number}
            className="animate-fade-up"
            style={{
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 20,
              padding: "36px 28px",
              animationDelay: `${0.1 + i * 0.12}s`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background number watermark */}
            <div
              style={{
                position: "absolute",
                top: -10,
                right: 16,
                fontFamily: "'Playfair Display', serif",
                fontSize: 96,
                fontWeight: 700,
                color: "rgba(255,210,0,0.04)",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              {step.number}
            </div>

            <div style={{ fontSize: 36, marginBottom: 20 }}>{step.emoji}</div>

            <div
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#ffd200",
                marginBottom: 10,
              }}
            >
              Step {step.number}
            </div>

            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 22,
                fontWeight: 600,
                margin: "0 0 12px",
              }}
            >
              {step.title}
            </h3>

            <p
              style={{
                fontFamily: "'Lato', sans-serif",
                fontSize: 15,
                color: "rgba(240,235,227,0.55)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {step.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div
        className="animate-fade-up"
        style={{
          textAlign: "center",
          marginTop: 64,
          animationDelay: "0.4s",
        }}
      >
        <Link
          href="/"
          style={{
            background: "linear-gradient(135deg, #f7971e, #ffd200)",
            color: "#1a1a2e",
            borderRadius: 14,
            padding: "16px 40px",
            fontWeight: 700,
            fontSize: 16,
            textDecoration: "none",
            fontFamily: "'Lato', sans-serif",
            display: "inline-block",
            boxShadow: "0 8px 32px rgba(247,151,30,0.3)",
          }}
        >
          Start splitting for free ✈️
        </Link>
      </div>
    </section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer
      style={{
        position: "relative",
        zIndex: 1,
        textAlign: "center",
        padding: "32px 24px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "'Lato', sans-serif",
        fontSize: 13,
        color: "rgba(240,235,227,0.3)",
      }}
    >
      Built with ✈️ by TripSplit · No login. No drama. Just fair splits.
    </footer>
  );
}
