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
| `/app` | `app/app/page.tsx` | The trip splitter app |
