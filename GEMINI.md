# TripSplit Project Status

This file tracks the development progress of the TripSplit application.

## 🚀 Completed Tasks

- **Project Scaffolding**: Initial Next.js project structure, type definitions, and core context established.
- **E2E Testing Setup**: 
    - Playwright configured and activated.
    - Stability issues resolved by disabling CSS animations during tests and using `force: true` for interactions where necessary.
    - Verified full trip flow (Setup -> Expenses -> Settlement).
- **UI Enhancements**:
    - **Category Selector**: Styled `select` and `option` elements in `ExpenseForm` to match the dark theme, including a custom dropdown chevron.
    - **Amount Input**: Hidden the default number input arrows (spinners) globally to maintain a clean aesthetic.
- **Project Maintenance**:
    - Updated `.gitignore` to exclude Gemini-specific metadata and the `md-tasks/` directory.

## 📋 Remaining Tasks (Refer to md-tasks/)

The following task-tracking files have been moved to the `../md-tasks/` directory for better organization:
- `SCAFFOLD.md`: Project bootstrapping and initial implementation steps.
- `BUILD.md`: Build and deployment instructions.

## 🛠️ Tech Stack
- **Framework**: Next.js 16 (Turbopack)
- **Styling**: Vanilla CSS with CSS Variables
- **State Management**: React Context
- **Testing**: Vitest (Unit/Integration), Playwright (E2E)

## Landing Page (BUILT)

- Route: `/home` → `app/home/page.tsx`
- Sections: Nav, Hero, How It Works (3 steps), Footer
- Aesthetic: matches app — dark night sky, gold accents, glassmorphism
- No new dependencies — uses existing globals.css variables and fonts
- Hero includes a static preview card showing a mock settlement plan

## Routes

| URL | File | Description |
|---|---|---|
| `/` | `app/page.tsx` | Redirects to `/home` |
| `/home` | `app/home/page.tsx` | Landing page |
| `/split` | `app/split/page.tsx` | The trip splitter app |

## Read-Only Mode (BUILT)

When a user opens a shared link (?trip= param exists on load):
- `isSharedView` = true (from useTrip context)
- App jumps straight to the result/settlement step
- Settlement page shows a purple "👀 read-only" banner
- "Edit Expenses" and "New Trip" buttons are hidden
- Replaced with a "Start your own trip ✈️" CTA linking to /split
- ShareButton is still visible so they can re-share the link
- Owner (isSharedView = false) sees the normal Edit + New Trip buttons

## Affiliate Cards (BUILT)

### Placement
- Expenses page (step 2) → Yesim card (after ShareButton)
- Result page (step 3) → Klook card (above category breakdown)

### Components
- `components/AffiliateCard.tsx` — reusable base card
- `components/YesimCard.tsx` — Yesim instance (orange #f97316)
- `components/KlookCard.tsx` — Klook instance (red #ef4444)

### QR Code Images
- `public/affiliates/klook-qr-code.jpeg`
- `public/affiliates/yesim-qr-code.jpeg`

### Environment Variables
- `NEXT_PUBLIC_KLOOK_URL` — Klook affiliate link
- `NEXT_PUBLIC_YESIM_URL` — Yesim affiliate link

### Adding More Affiliates Later (Booking.com, Agoda)
1. Add QR code image to `public/affiliates/`
2. Add env var to `.env.local` and Vercel dashboard
3. Create `components/BookingCard.tsx` using `AffiliateCard` base
4. Drop into desired step page

## OG Image + SEO (BUILT)

### OG Images (Next.js ImageResponse — edge runtime)
- `app/opengraph-image.tsx` — landing page OG image (1200x630)
- `app/split/opengraph-image.tsx` — app OG image with mock settlement card
- `app/icon.tsx` — dynamic ✈️ favicon (32x32)

### Metadata
- Root metadata in `app/layout.tsx` — metadataBase, default title template,
  keywords, OG, Twitter card, robots
- Page-level metadata in `app/home/page.tsx` and `app/split/page.tsx`
- All pages use canonical URLs via `alternates.canonical`
- Title template: "%s | TripSplit" — page titles auto-append brand name

### Crawling
- `app/sitemap.ts` → `/sitemap.xml`
- `app/robots.ts` → `/robots.txt`
- Both use `NEXT_PUBLIC_APP_URL` env var for base URL

### Testing OG Images Locally
- `http://localhost:3000/opengraph-image`
- `http://localhost:3000/split/opengraph-image`

### Testing After Deploy
- https://opengraph.xyz — paste live URL to preview card
- https://cards-dev.twitter.com/validator — Twitter card preview
- WhatsApp: paste URL in a chat to confirm preview renders
