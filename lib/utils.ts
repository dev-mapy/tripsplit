export const randomId = () => Math.random().toString(36).slice(2, 8);

export const formatAmount = (amount: number, symbol: string) =>
  `${symbol}${amount.toFixed(2)}`;

export const getInitial = (name: string) => name[0].toUpperCase();

export const avatarColor = (index: number) =>
  `hsl(${index * 60 + 200}, 60%, 55%)`;

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};
