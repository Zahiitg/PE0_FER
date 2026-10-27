"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="border-b bg-background w-full">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <Link href="/" className="font-bold text-xl shrink-0">
          SpendWise
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          {loading ? null : user ? (
            <>
              <span
                data-testid="user-email"
                className="text-sm font-medium max-w-[130px] sm:max-w-none truncate"
                title={user.email}
              >
                {user.email}
              </span>
              <Button asChild variant="ghost" size="sm">
                <Link data-testid="link-expenses" href="/expenses">
                  Expenses
                </Link>
              </Button>
              <Button
                data-testid="btn-logout"
                variant="outline"
                size="sm"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link data-testid="btn-login" href="/login">
                  Login
                </Link>
              </Button>
              <Button asChild size="sm">
                <Link data-testid="btn-register" href="/register">
                  Register
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
