export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  spent_on: string;
  note: string;
  created_at: string;
}

export const money = (cents: number): string => "$" + (cents / 100).toFixed(2);

export const compareExpenses = (a: Expense, b: Expense): number =>
  b.spent_on.localeCompare(a.spent_on) || b.created_at.localeCompare(a.created_at);

export function summarize(list: Expense[]) {
  let total = 0;
  const by = new Map<string, number>();
  for (const e of list) {
    const c = Math.round(e.amount * 100);
    total += c;
    by.set(e.category, (by.get(e.category) ?? 0) + c);
  }
  const breakdown = [...by]
    .map(([name, cents]) => ({ name, cents }))
    .sort((a, b) => b.cents - a.cents || a.name.localeCompare(b.name));
  return { total, count: list.length, breakdown };
}

export function todayStr(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function validateExpense(values: {
  amount: string;
  category: string;
  date: string;
  note: string;
}) {
  const errors: {
    amount?: string;
    category?: string;
    date?: string;
    note?: string;
  } = {};

  const trimmedAmount = values.amount.trim();
  if (!trimmedAmount) {
    errors.amount = "Amount is required";
  } else {
    const num = Number(trimmedAmount);
    const cents = Math.round(num * 100);
    if (isNaN(num) || cents <= 0) {
      errors.amount = "Amount must be greater than 0";
    }
  }

  if (!values.category) {
    errors.category = "Please choose a category";
  }

  const trimmedDate = values.date.trim();
  if (!trimmedDate) {
    errors.date = "Date is required";
  } else if (trimmedDate > todayStr()) {
    errors.date = "Date cannot be in the future";
  }

  if (Array.from(values.note).length > 100) {
    errors.note = "Note must be at most 100 characters";
  }

  return errors;
}
