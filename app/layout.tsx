import type { Metadata } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TripProvider } from "@/lib/trip-context";
import { AuthProvider } from "@/lib/auth-context";
import { getBaseUrl } from "@/lib/utils";

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "TripSplit — Split travel expenses with friends",
    template: "%s | TripSplit",
  },
  description:
    "The easiest way to split trip expenses. Add your costs, share one link, and everyone sees exactly who owes what. No account needed.",
  keywords: [
    "travel expense splitter",
    "trip cost calculator",
    "split expenses",
    "travel budget",
    "group travel",
    "chip in calculator",
    "no login expense tracker",
  ],
  authors: [{ name: "TripSplit" }],
  creator: "TripSplit",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: getBaseUrl(),
    siteName: "TripSplit",
    title: "TripSplit — Split travel expenses with friends",
    description:
      "Split travel expenses fairly with friends. No sign-up required — just create a trip, add expenses, and share one link.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TripSplit — Split travel expenses with friends",
    description:
      "Split travel expenses fairly with friends. No sign-up required — just create a trip, add expenses, and share one link.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@300;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Script
          id="travelpayouts-monetization"
          src="https://emrldco.com/NTA2OTk3.js?t=506997"
          strategy="afterInteractive"
          data-noptimize="1"
          data-cfasync="false"
          data-wpfc-render="false"
        />
        <NuqsAdapter>
          <Suspense fallback={null}>
            <AuthProvider>
              <TripProvider>{children}</TripProvider>
            </AuthProvider>
          </Suspense>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
