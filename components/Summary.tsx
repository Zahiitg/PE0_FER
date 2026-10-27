"use client";

import React from "react";
import { useExpenses } from "@/contexts/ExpensesContext";
import { money } from "@/lib/expenseUtils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function Summary() {
  const { summary } = useExpenses();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Total</span>
            <p data-testid="total-amount" className="text-2xl font-bold">
              {money(summary.total)}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">Count</span>
            <p data-testid="expense-count" className="text-2xl font-bold">
              {summary.count}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t">
          <span className="text-sm font-semibold mb-2 block">Category Breakdown</span>
          <div data-testid="category-breakdown" className="space-y-2">
            {summary.breakdown.map((row) => (
              <div
                key={row.name}
                data-testid="breakdown-row"
                className="flex items-center justify-between text-sm py-1 border-b last:border-b-0"
              >
                <span data-testid="breakdown-name" className="text-muted-foreground">
                  {row.name}
                </span>
                <span data-testid="breakdown-amount" className="font-semibold">
                  {money(row.cents)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Summary;
