import type { Currency } from "@/types";

export const CURRENCIES: Currency[] = [
  { code: "USD", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", symbol: "¥", flag: "🇯🇵" },
  { code: "PHP", symbol: "₱", flag: "🇵🇭" },
  { code: "AUD", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", symbol: "C$", flag: "🇨🇦" },
  { code: "SGD", symbol: "S$", flag: "🇸🇬" },
];

export const CATEGORIES = [
  "🍽️ Food",
  "🏨 Hotel",
  "✈️ Transport",
  "🎭 Activities",
  "🛍️ Shopping",
  "⚕️ Health",
  "📦 Other",
];

export const DEFAULT_CURRENCY = CURRENCIES[0];

export const MAX_FREE_TRIPS = 3;
export const MAX_TRAVELERS = 99;
export const MAX_EXPENSES = 99;
export const MAX_TRAVELER_NAME = 20;
export const MAX_TRIP_NAME = 50;

export const ENABLE_AUTH = process.env.NEXT_PUBLIC_ENABLE_AUTH !== "false";
