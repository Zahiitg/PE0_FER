"use client";

import React, { useState } from "react";
import { useExpenses } from "@/contexts/ExpensesContext";
import { money } from "@/lib/expenseUtils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ExpenseList() {
  const { visible, loaded, deleteExpense, expenseError, setExpenseError } = useExpenses();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!loaded) {
    return null;
  }

  const handleDelete = async (id: string) => {
    setExpenseError(null);
    setDeletingId(id);
    try {
      const res = await deleteExpense(id);
      if (res.error) {
        setExpenseError(res.error);
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {expenseError && (
        <p data-testid="error-expense" className="text-sm text-destructive font-medium">
          {expenseError}
        </p>
      )}

      {visible.length === 0 ? (
        <Card className="p-8 text-center">
          <p data-testid="expenses-empty" className="text-muted-foreground font-medium">
            No expenses found
          </p>
        </Card>
      ) : (
        <div data-testid="expense-list" className="space-y-3">
          {visible.map((expense) => {
            const cents = Math.round(expense.amount * 100);
            return (
              <Card
                key={expense.id}
                data-testid="expense-item"
                className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div className="min-w-0 flex-1 w-full">
                  <div className="flex items-center justify-between sm:justify-start gap-2 flex-wrap">
                    <span
                      data-testid="expense-category"
                      className="font-semibold text-foreground text-sm"
                    >
                      {expense.category}
                    </span>
                    <span
                      data-testid="expense-date"
                      className="text-xs text-muted-foreground"
                    >
                      {expense.spent_on}
                    </span>
                  </div>
                  <p
                    data-testid="expense-note"
                    className="text-sm text-muted-foreground break-words mt-1"
                  >
                    {expense.note}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0">
                  <span
                    data-testid="expense-amount"
                    className="font-bold text-base whitespace-nowrap"
                  >
                    {money(cents)}
                  </span>
                  <Button
                    data-testid="btn-delete-expense"
                    variant="destructive"
                    size="sm"
                    disabled={deletingId === expense.id}
                    onClick={() => handleDelete(expense.id)}
                  >
                    {deletingId === expense.id ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
