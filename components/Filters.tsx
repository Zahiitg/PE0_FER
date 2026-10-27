"use client";

import React from "react";
import { useExpenses } from "@/contexts/ExpensesContext";
import { CATEGORIES } from "@/lib/expenseUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Filters() {
  const { filterCategory, setFilterCategory, filterMonth, setFilterMonth, clearFilters } =
    useExpenses();

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full space-y-1">
            <Label htmlFor="filter-category">Filter Category</Label>
            <select
              id="filter-category"
              data-testid="filter-category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">All</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1 w-full space-y-1">
            <Label htmlFor="filter-month">Filter Month</Label>
            <Input
              id="filter-month"
              data-testid="filter-month"
              type="month"
              value={filterMonth}
              onChange={(e) => setFilterMonth(e.target.value)}
            />
          </div>

          <Button
            data-testid="btn-clear-filters"
            variant="outline"
            onClick={clearFilters}
            className="w-full sm:w-auto"
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default Filters;
