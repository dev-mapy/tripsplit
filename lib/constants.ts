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
