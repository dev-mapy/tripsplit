import type { Metadata } from "next";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import "./globals.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TripProvider } from "@/lib/trip-context";

export const metadata: Metadata = {
  title: "TripSplit — No login. No drama. Just fair splits.",
  description: "Split travel expenses with friends. No account needed.",
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
            <TripProvider>{children}</TripProvider>
          </Suspense>
        </NuqsAdapter>
        <Analytics />
      </body>
    </html>
  );
}
