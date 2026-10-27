"use client";

import React, { useState } from "react";
import { useExpenses } from "@/contexts/ExpensesContext";
import { CATEGORIES, validateExpense, todayStr } from "@/lib/expenseUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ExpenseForm() {
  const { addExpense, setExpenseError } = useExpenses();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  const [errors, setErrors] = useState<{
    amount?: string;
    category?: string;
    date?: string;
    note?: string;
  }>({});

  const [expenseSuccess, setExpenseSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setAmount(val);
    setExpenseSuccess(null);
    setExpenseError(null);

    if (errors.amount) {
      const trimmed = val.trim();
      if (!trimmed) {
        setErrors((prev) => ({ ...prev, amount: "Amount is required" }));
      } else {
        const num = Number(trimmed);
        const cents = Math.round(num * 100);
        if (isNaN(num) || cents <= 0) {
          setErrors((prev) => ({ ...prev, amount: "Amount must be greater than 0" }));
        } else {
          setErrors((prev) => {
            const next = { ...prev };
            delete next.amount;
            return next;
          });
        }
      }
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setCategory(val);
    setExpenseSuccess(null);
    setExpenseError(null);

    if (errors.category) {
      if (!val) {
        setErrors((prev) => ({ ...prev, category: "Please choose a category" }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.category;
          return next;
        });
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDate(val);
    setExpenseSuccess(null);
    setExpenseError(null);

    if (errors.date) {
      const trimmed = val.trim();
      if (!trimmed) {
        setErrors((prev) => ({ ...prev, date: "Date is required" }));
      } else if (trimmed > todayStr()) {
        setErrors((prev) => ({ ...prev, date: "Date cannot be in the future" }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.date;
          return next;
        });
      }
    }
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNote(val);
    setExpenseSuccess(null);
    setExpenseError(null);

    if (errors.note) {
      if (Array.from(val).length > 100) {
        setErrors((prev) => ({ ...prev, note: "Note must be at most 100 characters" }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.note;
          return next;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setExpenseSuccess(null);
    setExpenseError(null);

    const validationErrors = validateExpense({ amount, category, date, note });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const numAmount = Math.round(Number(amount) * 100) / 100;
    if (numAmount <= 0) {
      setErrors({ amount: "Amount must be greater than 0" });
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await addExpense({
        amount: numAmount,
        category,
        spent_on: date,
        note,
      });

      if (res.error) {
        setExpenseError(res.error);
      } else {
        setExpenseSuccess("Expense added");
        setAmount("");
        setCategory("");
        setDate("");
        setNote("");
        setErrors({});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Add Expense</CardTitle>
      </CardHeader>
      <CardContent>
        <form data-testid="expense-form" noValidate onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="input-amount">Amount</Label>
            <Input
              id="input-amount"
              data-testid="input-amount"
              type="number"
              step="0.01"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
            />
            {errors.amount && (
              <p data-testid="error-amount" className="text-sm text-destructive">
                {errors.amount}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="select-category">Category</Label>
            <select
              id="select-category"
              data-testid="select-category"
              value={category}
              onChange={handleCategoryChange}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Choose category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p data-testid="error-category" className="text-sm text-destructive">
                {errors.category}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="input-date">Date</Label>
            <Input
              id="input-date"
              data-testid="input-date"
              type="date"
              value={date}
              onChange={handleDateChange}
            />
            {errors.date && (
              <p data-testid="error-date" className="text-sm text-destructive">
                {errors.date}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="input-note">Note</Label>
            <Input
              id="input-note"
              data-testid="input-note"
              type="text"
              value={note}
              onChange={handleNoteChange}
              placeholder="Optional description"
            />
            {errors.note && (
              <p data-testid="error-note" className="text-sm text-destructive">
                {errors.note}
              </p>
            )}
          </div>

          {expenseSuccess && (
            <p data-testid="expense-success" className="text-sm text-green-600 font-medium">
              {expenseSuccess}
            </p>
          )}

          <Button
            data-testid="btn-add-expense"
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Expense"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default ExpenseForm;
