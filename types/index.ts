export interface Traveler {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  desc: string;
  amount: number;
  category: string;
  paidBy: string;       // Traveler id
  splitAmong: string[]; // Traveler ids
}

export interface Trip {
  name: string;
  currency: Currency;
  travelers: Traveler[];
  expenses: Expense[];
}

export interface Currency {
  code: string;
  symbol: string;
  flag: string;
}

export interface Transaction {
  from: string; // Traveler id
  to: string;   // Traveler id
  amount: number;
}

export interface Settlement {
  balances: Record<string, number>;
  transactions: Transaction[];
}

export interface SavedTrip {
  id: string;
  slug: string;
  userId: string;
  name: string;
  currencyCode: string;
  travelers: Traveler[];
  expenses: Expense[];
  createdAt: string;
  updatedAt: string;
}

export interface SaveTripPayload {
  name: string;
  slug: string;
  currencyCode: string;
  travelers: Traveler[];
  expenses: Expense[];
}
