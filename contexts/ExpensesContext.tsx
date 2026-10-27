"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useMemo,
  useState,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./AuthContext";
import {
  Expense,
  compareExpenses,
  summarize,
} from "@/lib/expenseUtils";

interface ExpensesState {
  expenses: Expense[];
  loaded: boolean;
  filterCategory: string;
  filterMonth: string;
}

type ExpensesAction =
  | { type: "RESET" }
  | { type: "SET"; payload: Expense[] }
  | { type: "ADD"; payload: Expense }
  | { type: "REMOVE"; payload: string }
  | { type: "SET_CATEGORY"; payload: string }
  | { type: "SET_MONTH"; payload: string }
  | { type: "CLEAR_FILTERS" };

const initialState: ExpensesState = {
  expenses: [],
  loaded: false,
  filterCategory: "",
  filterMonth: "",
};

function expensesReducer(state: ExpensesState, action: ExpensesAction): ExpensesState {
  switch (action.type) {
    case "RESET":
      return {
        expenses: [],
        loaded: false,
        filterCategory: "",
        filterMonth: "",
      };
    case "SET":
      return {
        ...state,
        expenses: [...action.payload].sort(compareExpenses),
        loaded: true,
      };
    case "ADD": {
      const next = [action.payload, ...state.expenses].sort(compareExpenses);
      return {
        ...state,
        expenses: next,
      };
    }
    case "REMOVE":
      return {
        ...state,
        expenses: state.expenses.filter((e) => e.id !== action.payload),
      };
    case "SET_CATEGORY":
      return {
        ...state,
        filterCategory: action.payload,
      };
    case "SET_MONTH":
      return {
        ...state,
        filterMonth: action.payload,
      };
    case "CLEAR_FILTERS":
      return {
        ...state,
        filterCategory: "",
        filterMonth: "",
      };
    default:
      return state;
  }
}

interface ExpensesContextType {
  expenses: Expense[];
  visible: Expense[];
  summary: ReturnType<typeof summarize>;
  loaded: boolean;
  filterCategory: string;
  filterMonth: string;
  setFilterCategory: (category: string) => void;
  setFilterMonth: (month: string) => void;
  clearFilters: () => void;
  addExpense: (data: {
    amount: number;
    category: string;
    spent_on: string;
    note?: string;
  }) => Promise<{ error?: string }>;
  deleteExpense: (id: string) => Promise<{ error?: string }>;
  expenseError: string | null;
  setExpenseError: (err: string | null) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export function ExpensesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(expensesReducer, initialState);
  const [expenseError, setExpenseError] = useState<string | null>(null);

  useEffect(() => {
    dispatch({ type: "RESET" });
    setExpenseError(null);

    if (!user) {
      return;
    }

    let active = true;

    async function fetchExpenses() {
      const { data, error } = await supabase
        .from("expenses")
        .select("id, user_id, amount, category, spent_on, note, created_at")
        .order("spent_on", { ascending: false })
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        setExpenseError(error.message);
        dispatch({ type: "SET", payload: [] });
      } else if (data) {
        const parsed: Expense[] = data.map((item) => ({
          ...item,
          amount: Number(item.amount),
        }));
        dispatch({ type: "SET", payload: parsed });
      }
    }

    fetchExpenses();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const setFilterCategory = (category: string) => {
    dispatch({ type: "SET_CATEGORY", payload: category });
  };

  const setFilterMonth = (month: string) => {
    dispatch({ type: "SET_MONTH", payload: month });
  };

  const clearFilters = () => {
    dispatch({ type: "CLEAR_FILTERS" });
  };

  const addExpense = async (newExpense: {
    amount: number;
    category: string;
    spent_on: string;
    note?: string;
  }): Promise<{ error?: string }> => {
    const { data, error } = await supabase
      .from("expenses")
      .insert([
        {
          amount: newExpense.amount,
          category: newExpense.category,
          spent_on: newExpense.spent_on,
          note: newExpense.note ?? "",
        },
      ])
      .select("id, user_id, amount, category, spent_on, note, created_at")
      .single();

    if (error) {
      return { error: error.message };
    }

    if (data) {
      dispatch({
        type: "ADD",
        payload: {
          ...data,
          amount: Number(data.amount),
        },
      });
    }

    return {};
  };

  const deleteExpense = async (id: string): Promise<{ error?: string }> => {
    const { data, error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .select("id");

    if (error) {
      return { error: error.message };
    }

    if (!data || data.length === 0) {
      return { error: "Failed to delete expense" };
    }

    dispatch({ type: "REMOVE", payload: id });
    return {};
  };

  const visible = useMemo(() => {
    return state.expenses.filter((e) => {
      const matchCat = !state.filterCategory || e.category === state.filterCategory;
      const matchMonth = !state.filterMonth || e.spent_on.startsWith(state.filterMonth);
      return matchCat && matchMonth;
    });
  }, [state.expenses, state.filterCategory, state.filterMonth]);

  const summary = useMemo(() => {
    return summarize(visible);
  }, [visible]);

  return (
    <ExpensesContext.Provider
      value={{
        expenses: state.expenses,
        visible,
        summary,
        loaded: state.loaded,
        filterCategory: state.filterCategory,
        filterMonth: state.filterMonth,
        setFilterCategory,
        setFilterMonth,
        clearFilters,
        addExpense,
        deleteExpense,
        expenseError,
        setExpenseError,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpensesContext);
  if (!context) {
    throw new Error("useExpenses must be used within an ExpensesProvider");
  }
  return context;
}
