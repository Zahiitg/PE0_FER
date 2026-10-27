"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

export function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="border-b bg-background">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          SpendWise
        </Link>
        <div className="flex items-center gap-3">
          {loading ? null : user ? (
            <>
              <span data-testid="user-email" className="text-sm font-medium">
                {user.email}
              </span>
              <Button asChild variant="ghost">
                <Link data-testid="link-expenses" href="/expenses">
                  Expenses
                </Link>
              </Button>
              <Button
                data-testid="btn-logout"
                variant="outline"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link data-testid="btn-login" href="/login">
                  Login
                </Link>
              </Button>
              <Button asChild>
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
