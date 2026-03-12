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

## Database Schema (BUILT)

### ORM
Prisma with Supabase Postgres

### Table: saved_trips
| Column        | Type     | Notes                          |
|---|---|---|
| id            | String   | cuid() primary key             |
| slug          | String   | unique, URL-safe identifier    |
| user_id       | String   | Supabase Auth user UUID        |
| name          | String   | trip name                      |
| currency_code | String   | e.g. "USD", "PHP"              |
| travelers     | Json     | Traveler[] array               |
| expenses      | Json     | Expense[] array                |
| created_at    | DateTime | auto                           |
| updated_at    | DateTime | auto                           |

### Row Level Security (RLS)
- SELECT: users can read own trips OR anyone can read by slug (public)
- INSERT: only authenticated user can insert own trips
- UPDATE: only owner can update
- DELETE: only owner can delete

### Key Files
- `prisma/schema.prisma` — schema definition
- `lib/prisma.ts` — singleton Prisma client
- `lib/utils.ts` — generateSlug(), uniqueSlug()

### Slug Format
- Generated from trip name: "Bali 2026 🌴" → "bali-2026"
- Unique suffix appended if collision: "bali-2026-a1b2c3"
- Max 50 chars, URL-safe, lowercase, hyphens only

### Env Vars
- DATABASE_URL — Supabase connection string (server only)
- DIRECT_URL — same as DATABASE_URL (required by Prisma for migrations)

## Save Trip API (BUILT)

### API Routes
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/trips | Required | Save a new trip |
| GET | /api/trips | Required | Get all trips for current user |
| GET | /api/trips/[slug] | Public | Get a trip by slug |
| PATCH | /api/trips/[slug] | Owner only | Update a trip |
| DELETE | /api/trips/[slug] | Owner only | Delete a trip |

### API Client (`lib/api.ts`)
- saveTrip(payload) → { slug, url }
- fetchUserTrips() → SavedTrip[]
- fetchTripBySlug(slug) → SavedTrip | null
- updateTrip(slug, payload) → { slug, updatedAt }
- deleteTrip(slug) → void

### Slug Generation
- generateSlug("Bali 2026 🌴") → "bali-2026"
- uniqueSlug("bali-2026") → "bali-2026-a1b2c3"
- Collision check on POST — auto-appends suffix if slug taken

### Security
- POST/PATCH/DELETE require authenticated user (401 if not)
- PATCH/DELETE verify ownership (403 if not owner)
- GET /api/trips/[slug] is public — no auth required

## Save Trip UI (BUILT)

### Components
- `components/SignInModal.tsx` — Google sign-in modal with perks list
  - Props: onClose(), reason: "save" | "dashboard"
  - Shows different messaging based on reason
  - Reassures user that TripSplit still works without signing in

- `components/SaveTripButton.tsx` — save button on settlement page
  - Shows "Sign in to save →" if not authenticated
  - Opens SignInModal if not signed in
  - Calls POST /api/trips and redirects to /t/[slug] on success
  - Only visible to trip owner (hidden in isSharedView)

- `components/UserNav.tsx` — avatar + dropdown in app header
  - Shows "Sign in" button if not authenticated
  - Shows avatar (Google photo or initials) if signed in
  - Dropdown: My Trips → /dashboard, New Trip → /split, Sign out

### Flow
1. User finishes trip → sees "Save this trip" card on result page
2. Clicks "Sign in to save →" → SignInModal appears
3. Clicks "Continue with Google" → redirected to Google OAuth
4. Returns to /auth/callback → session created → redirected to /dashboard
   (Note: after OAuth redirect, user will need to save again from /split
   or from their session — this is standard OAuth behavior)
5. Once signed in, "Save trip →" button saves directly
6. On save success → redirected to /t/[slug]


## Saved Trip Page (BUILT)

### Route
`/t/[slug]` → `app/t/[slug]/page.tsx` (server) + `SavedTripView.tsx` (client)

### Behavior
- Server fetches trip from DB by slug
- If not found → renders `not-found.tsx` (404)
- Passes trip data to `SavedTripView` client component
- `isOwner` = user.id === trip.userId
  - Owner: sees "Save changes" bar + can edit/add expenses
  - Non-owner: sees read-only banner + "Start your own trip" CTA

### Components
- `app/t/[slug]/page.tsx` — server component, fetches trip, generates metadata
- `app/t/[slug]/SavedTripView.tsx` — client component, full trip UI
- `app/t/[slug]/not-found.tsx` — 404 page for missing slugs

### ShareButton Update
- Now accepts optional `overrideUrl` prop
- Used on saved trip page to share `/t/[slug]` instead of `?trip=` URL

### TripProvider Update
- Now accepts optional `initialTrip` prop
- Used by SavedTripView to seed context with DB trip data

## Dashboard (BUILT)

### Route
`/dashboard` → `app/dashboard/page.tsx` (server) + `DashboardView.tsx` (client)

### Behavior
- Server-side auth check — redirects to /home?signin=required if not signed in
- Fetches all trips for the current user ordered by createdAt desc
- Passes shaped trip summaries to DashboardView client component

### TripSummary shape (passed to client)
{
  id, slug, name, currencyCode, currencySymbol, currencyFlag,
  travelerCount, expenseCount, total, createdAt, updatedAt
}

### Features
- Trip cards with name, total, travelers, expenses, date, slug
- "View →" links to /t/[slug]
- Delete with inline confirmation overlay (cannot be undone)
- Empty state with CTA to create first trip
- User avatar + first name + sign out in header
- "New Trip" CTA always visible at top

### Protected by
- Server-side redirect in page.tsx
- middleware.ts (redirects /dashboard to /home if no session)
