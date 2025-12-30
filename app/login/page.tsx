"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  clearAuthError,
  loginWithPassword,
  selectAuthError,
  selectAuthStatus,
  selectHomePath,
} from "../features/auth/authSlice";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const homePath = useAppSelector(selectHomePath);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!error) return;
    toast.error(error);
  }, [error]);

  useEffect(() => {
    if (status === "authenticated" && homePath !== "/login") {
      router.replace(homePath);
    }
  }, [status, homePath, router]);

  const isSubmitting = status === "loading";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4 text-[var(--color-text)]">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Handyman</h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            Login to continue
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const trimmedEmail = email.trim();
            if (!trimmedEmail || !password) {
              toast.info("Enter email and password");
              return;
            }

            const result = await dispatch(
              loginWithPassword({ email: trimmedEmail, password })
            );

            if (!loginWithPassword.fulfilled.match(result)) return;

            if (result.payload.role === "admin") {
              toast.success("Welcome, admin");
              router.replace("/admin/dashboard");
              return;
            }

            if (result.payload.role === "supervisor") {
              toast.success("Welcome, supervisor");
              router.replace("/supervisor/dashboard");
              return;
            }

            toast.info("Signed in");
            router.replace("/login");
          }}
        >
          <input
            type="email"
            placeholder="Email"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) dispatch(clearAuthError());
            }}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2 text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) dispatch(clearAuthError());
            }}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-[var(--color-accent)] py-2 font-medium text-[var(--color-on-accent)] hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {error ? (
          <p className="mt-4 text-center text-sm text-[var(--color-accent)]">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
