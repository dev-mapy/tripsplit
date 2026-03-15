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
import { ENABLE_AUTH } from "@/lib/constants";

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
    <main className="min-h-screen overflow-x-hidden relative">
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
  const avatarColors = [
    "bg-brand",
    "bg-brand/80",
    "bg-brand/60",
    "bg-brand/40",
  ];

  return (
    <Section padding="pt-12 pb-24 md:pt-20 md:pb-32">
      <Container maxWidth={800} className="text-left md:text-center relative z-10">
        {/* Headline */}
        <Typography as="h1" variant="h1" className="mb-8 animate-fade-up [animation-delay:0.1s]">
          No app, no
          <br />
          login, <span className="text-brand">no</span>
          <br />
          <span className="text-brand">drama.</span>
        </Typography>

        {/* Subheadline */}
        <Typography variant="body" className="max-w-[540px] md:mx-auto mb-10 animate-fade-up [animation-delay:0.2s] text-text-muted">
          Split expenses with friends instantly. The simplest way to manage group trips without the overhead. Just create a link and share.
        </Typography>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4 md:justify-center animate-fade-up [animation-delay:0.3s]">
          <Button href="/split" size="lg" className="w-full sm:w-auto">
            Start a Trip
          </Button>
        </div>

        {/* Social Proof / Trusted By */}
        <div className="mt-12 flex flex-col items-center md:items-center gap-4 animate-fade-up [animation-delay:0.4s]">
          <div className="flex -space-x-3 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-bg-deep text-[13px] font-black text-white ${avatarColors[i-1]}`}
              >
                <span className="mb-[1px]">{String.fromCharCode(64 + i)}</span>
              </div>
            ))}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-4 ring-bg-deep bg-bg-dark text-[10px] font-black text-text-muted"
            >
              <span className="mb-[1px]">+12k</span>
            </div>
          </div>
          <Typography variant="sub" className="text-[11px] font-black uppercase tracking-[0.1em] text-text-faint">
            12k+ travelers splitting right now
          </Typography>
        </div>

        {/* Floating preview card - simplified and theme-matched */}
        <Card animate className="max-w-[440px] md:mx-auto mt-20 text-left [animation-delay:0.5s] border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand leading-none">
              ✈️
            </div>
            <div>
              <div className="text-[15px] font-bold text-white">Flight Tickets</div>
              <div className="text-[12px] text-text-faint">$420.00</div>
            </div>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success leading-none">
              🍴
            </div>
            <div>
              <div className="text-[15px] font-bold text-white">Dinner at Le Marais</div>
              <div className="text-[12px] text-text-faint">$115.50</div>
            </div>
          </div>
        </Card>
      </Container>
    </Section>
  );
}

/* ── How It Works ── */
function HowItWorks() {
  const steps = [
    {
      number: "01",
      icon: "🧳",
      title: "Create your trip",
      desc: "Name your trip, pick your currency, and add everyone who's coming along.",
    },
    {
      number: "02",
      icon: "🧾",
      title: "Log your expenses",
      desc: "Add each expense, who paid, and who it should be split among. TripSplit handles the math.",
    },
    {
      number: "03",
      icon: "🔗",
      title: "Share one link",
      desc: "Your entire trip is encoded into a single URL. Share it and everyone sees exactly who owes what.",
    },
  ];

  return (
    <Section className="bg-white/[0.01] border-y border-white/5 relative z-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className="animate-fade-up"
              style={{ animationDelay: `${0.2 + i * 0.1}s` }}
            >
              <div className="text-3xl mb-6 bg-brand/10 w-14 h-14 rounded-2xl flex items-center justify-center">
                {step.icon}
              </div>
              <Typography variant="h3" className="mb-4 text-white">
                {step.title}
              </Typography>
              <Typography variant="small" className="text-[15px] leading-relaxed">
                {step.desc}
              </Typography>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="relative z-10 py-12 px-6 border-t border-white/5 font-sans text-[12px] text-text-faint">
      <Container className="flex justify-between items-center gap-6">
        <div>© {new Date().getFullYear()} TripSplit</div>
      </Container>
    </footer>
  );
}
