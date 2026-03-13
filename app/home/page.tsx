import Link from "next/link";
import type { Metadata } from "next";
import { getBaseUrl, getCleanBaseUrl } from "@/lib/utils";
import { Nav } from "@/components/Nav";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Typography } from "@/components/ui/Typography";
import { StarsBackground } from "@/components/ui/StarsBackground";
import { Container, Section } from "@/components/ui/Layout";

export const metadata: Metadata = {
  title: "TripSplit — No login. No drama. Just fair splits.",
  description:
    "The easiest way to split trip expenses with friends. Add costs, share one link, and everyone sees who owes what. Free, no account needed.",
  alternates: {
    canonical: "/home",
  },
  openGraph: {
    title: "TripSplit — No login. No drama. Just fair splits.",
    description:
      "The easiest way to split trip expenses with friends. Share one link — no account needed.",
    url: "/home",
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <StarsBackground count={50} />
      <Nav />
      <Hero />
      <HowItWorks />
      <Footer />
    </main>
  );
}

/* ── Hero ── */
function Hero() {
  return (
    <Section padding="pt-20 pb-24 md:pt-30 md:pb-40">
      <Container maxWidth={780} className="text-center">
        {/* Eyebrow */}
        <Badge icon="✦" className="mb-8">
          No login. No app. No drama.
        </Badge>

        {/* Headline */}
        <Typography as="h1" variant="h1" className="mb-7 animate-fade-up [animation-delay:0.1s]">
          Split trip expenses
          <br />
          <span className="bg-linear-to-br from-gold to-gold-warm bg-clip-text text-transparent">
            with one link.
          </span>
        </Typography>

        {/* Subheadline */}
        <Typography variant="body" className="max-w-[520px] mx-auto mb-12 animate-fade-up [animation-delay:0.2s]">
          Add your group&apos;s expenses, and TripSplit calculates exactly who
          owes what. Share one link — no account needed.
        </Typography>

        {/* CTA */}
        <div className="flex gap-4 justify-center flex-wrap animate-fade-up [animation-delay:0.3s]">
          <Button href="/split">
            Split a trip now ✈️
          </Button>
        </div>

        {/* Trust badges */}
        <div className="flex gap-6 justify-center flex-wrap mt-9 animate-fade-up [animation-delay:0.4s]">
          {[
            "✓ No login required",
            "✓ No app to download",
            "✓ Free to use",
            "✓ Save trips with Google",
          ].map((badge) => (
            <span
              key={badge}
              className="font-sans text-sm text-text-faint/70"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Floating preview card */}
        <Card animate className="max-w-[480px] mx-auto mt-18 text-left [animation-delay:0.5s]">
          <Typography variant="sub" className="mb-4">
            💸 Settlement Plan
          </Typography>

          {[
            { from: "Bob", to: "Ana", amount: "$45.00" },
            { from: "Carlos", to: "Ana", amount: "$30.00" },
          ].map((tx, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-gold/7 border border-gold/15 rounded-xl px-[18px] py-3.5 mb-2.5 font-sans text-[15px]"
            >
              <div>
                <span className="font-bold text-danger">
                  {tx.from}
                </span>
                <span className="text-text-faint mx-2">
                  → pays →
                </span>
                <span className="font-bold text-success">{tx.to}</span>
              </div>
              <div className="font-serif text-lg font-bold text-gold">
                {tx.amount}
              </div>
            </div>
          ))}

          <div className="mt-4 px-4 py-3 bg-gold/6 border border-gold/15 rounded-lg text-[13px] font-sans text-text-muted flex items-center gap-2">
            <span className="text-gold">🔗</span>
            <span className="font-mono text-xs overflow-hidden text-ellipsis whitespace-nowrap">
              {getBaseUrl()}/?trip=QmFsaV8yMDI2...
            </span>
            <span className="ml-auto text-gold font-bold text-xs whitespace-nowrap">
              Copy
            </span>
          </div>
        </Card>

        {/* Feature highlights */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 max-w-[720px] mx-auto mt-12 animate-fade-up [animation-delay:0.6s]">
          {[
            {
              icon: "🔗",
              title: "Instant share link",
              desc: "Share a link immediately — no account needed.",
            },
            {
              icon: "💾",
              title: "Save permanently",
              desc: "Sign in with Google to get a clean link like /t/bali-2026.",
            },
            {
              icon: "📋",
              title: "Trip history",
              desc: "Access and edit all your saved trips anytime.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white/4 border border-white/8 rounded-2xl p-5 text-left"
            >
              <div className="text-[28px] mb-2.5">{f.icon}</div>
              <Typography variant="h3" className="mb-1.5 leading-tight">
                {f.title}
              </Typography>
              <p className="font-sans text-[13px] text-text-muted leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
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
    {
      number: "04",
      emoji: "💾",
      title: "Save & revisit",
      desc: `Sign in with Google to save your trip permanently and get a clean link like ${getCleanBaseUrl()}/t/bali-2026.`,
    },
  ];

  return (
    <Section>
      <Container>
        {/* Section label */}
        <div className="text-center mb-16">
          <Typography variant="eyebrow" className="mb-4 animate-fade-up">
            How it works
          </Typography>
          <Typography as="h2" variant="h2" className="animate-fade-up [animation-delay:0.1s] mb-0">
            From expenses to settled — in minutes
          </Typography>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {steps.map((step, i) => (
            <Card
              key={step.number}
              animate
              className="[animation-delay:0.2s] relative overflow-hidden group"
              style={{ animationDelay: `${0.1 + i * 0.12}s` }}
            >
              {/* Background number watermark */}
              <div className="absolute -top-2.5 right-4 font-serif text-[96px] font-bold text-gold/4 leading-none select-none">
                {step.number}
              </div>

              <div className="text-4xl mb-5">{step.emoji}</div>

              <div className="font-sans text-[11px] font-bold tracking-[1.5px] uppercase text-gold mb-2.5">
                Step {step.number}
              </div>

              <Typography variant="h3" className="mb-3">
                {step.title}
              </Typography>

              <p className="font-sans text-[15px] text-text-muted leading-[1.7]">
                {step.desc}
              </p>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-up [animation-delay:0.4s]">
          <Button href="/split">
            Start splitting for free ✈️
          </Button>
        </div>
      </Container>
    </Section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="relative z-10 text-center py-8 px-6 border-t border-white/6 font-sans text-[13px] text-text-faint">
      Built with ✈️ by TripSplit · No login. No drama. Just fair splits.
    </footer>
  );
}
