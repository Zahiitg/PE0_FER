"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ExpenseForm from "@/components/ExpenseForm";

export default function ExpensesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <div data-testid="expenses-page" className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-6">
          <ExpenseForm />
        </div>

        <div className="lg:col-span-2 space-y-6">
        </div>
      </div>
    </div>
  );
}
