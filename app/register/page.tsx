"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const { signUp } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [authError, setAuthError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (errors.email) {
      const trimmed = val.trim();
      if (!trimmed) {
        setErrors((prev) => ({ ...prev, email: "Email is required" }));
      } else if (!EMAIL_REGEX.test(trimmed)) {
        setErrors((prev) => ({ ...prev, email: "Please enter a valid email address" }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.email;
          return next;
        });
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (errors.password) {
      if (!val) {
        setErrors((prev) => ({ ...prev, password: "Password is required" }));
      } else if (val.length < 6) {
        setErrors((prev) => ({
          ...prev,
          password: "Password must be at least 6 characters",
        }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.password;
          return next;
        });
      }
    }
    if (errors.confirmPassword && confirmPassword) {
      if (confirmPassword === val) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.confirmPassword;
          return next;
        });
      }
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (errors.confirmPassword) {
      if (!val) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Confirm password is required" }));
      } else if (val !== password) {
        setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      } else {
        setErrors((prev) => {
          const next = { ...prev };
          delete next.confirmPassword;
          return next;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAuthError(null);
    setFormSuccess(null);

    const newErrors: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      newErrors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const result = await signUp(trimmedEmail, password);
      if (result.error) {
        setAuthError(result.error);
      } else {
        setFormSuccess("Registration successful!");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
          <CardDescription>Enter your details to create your SpendWise account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form data-testid="register-form" noValidate onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                data-testid="register-email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@example.com"
              />
              {errors.email && (
                <p data-testid="error-email" className="text-sm text-destructive">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                data-testid="register-password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
              />
              {errors.password && (
                <p data-testid="error-password" className="text-sm text-destructive">
                  {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="register-confirm-password">Confirm Password</Label>
              <Input
                id="register-confirm-password"
                data-testid="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
              />
              {errors.confirmPassword && (
                <p data-testid="error-confirm-password" className="text-sm text-destructive">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {authError && (
              <p data-testid="error-auth" className="text-sm text-destructive">
                {authError}
              </p>
            )}

            {formSuccess && (
              <p data-testid="form-success" className="text-sm text-green-600 font-medium">
                {formSuccess}
              </p>
            )}

            <Button
              data-testid="register-submit"
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? "Registering..." : "Register"}
            </Button>

            <div className="text-center text-sm text-muted-foreground pt-2">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
