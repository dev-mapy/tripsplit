export const randomId = () => Math.random().toString(36).slice(2, 8);

export const formatAmount = (amount: number, symbol: string) =>
  `${symbol}${amount.toFixed(2)}`;

export const getInitial = (name: string) => name[0].toUpperCase();

export const avatarColor = (index: number) =>
  `hsl(${index * 60 + 200}, 60%, 55%)`;

export const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }

  return "http://localhost:3000";
};

export const getCleanBaseUrl = () => {
  return getBaseUrl().replace(/^https?:\/\//, "");
};

/**
 * Generate a URL-safe slug from a trip name.
 * e.g. "Bali Summer 2026 🌴" → "bali-summer-2026"
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // remove emoji and special chars
    .trim()
    .replace(/\s+/g, "-") // spaces to hyphens
    .replace(/-+/g, "-") // collapse multiple hyphens
    .slice(0, 50); // max 50 chars
};

/**
 * Append a short random suffix to make a slug unique.
 * e.g. "bali-2026" → "bali-2026-a1b2c3"
 */
export const uniqueSlug = (base: string): string => {
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
};
