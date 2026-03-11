# TripSplit — Project Context

## What This Is
A no-login travel expense splitter SaaS. Users create a trip, add travelers,
log expenses, and get an auto-calculated settlement plan showing who pays whom.

## Stack
- Next.js 15 (App Router, Turbopack)
- TypeScript
- Tailwind CSS
- nuqs (URL state — shareable links)
- Vitest + React Testing Library (unit tests)
- Playwright (E2E tests)

## Key Files
- `types/index.ts` — all shared TypeScript types
- `lib/calculator.ts` — pure settlement logic (always unit test changes here)
- `lib/calculator.test.ts` — Vitest tests for calculator
- `e2e/trip.spec.ts` — Playwright E2E tests
- `components/` — UI components (TravelerSetup, ExpenseForm, ExpenseList, Settlement)
- `app/page.tsx` — main entry point

## Core Types
Traveler { id, name }
Expense { id, desc, amount, category, paidBy, splitAmong[] }
Trip { name, currency, travelers[], expenses[] }
Currency { code, symbol, flag }
Transaction { from, to, amount }
Settlement { balances: Record<string,number>, transactions: Transaction[] }

## Settlement Algorithm
1. Compute net balance per traveler (total paid minus total owed)
2. Split into creditors (positive balance) and debtors (negative balance)
3. Greedy match to minimize number of transactions
4. Round all amounts to 2 decimal places

## Supported Currencies
USD, EUR, GBP, JPY, PHP, AUD, CAD, SGD

## Expense Categories
Food, Hotel, Transport, Activities, Shopping, Health, Other

## App Flow (3 steps)
1. Setup — trip name, currency, travelers
2. Expenses — add/edit/delete expenses (modal form)
3. Result — settlement plan + balances + category breakdown

## Coding Rules
- All IDs: Math.random().toString(36).slice(2, 8)
- Amounts: stored as float, displayed with .toFixed(2)
- No form tags — use onClick/onChange handlers only
- No localStorage — use nuqs for persistence via URL
- Always update calculator.test.ts when changing calculator.ts

## Not Yet Built
- Shareable link (nuqs wiring)
- Multi-currency conversion
- PDF export
- Backend / persistent storage
