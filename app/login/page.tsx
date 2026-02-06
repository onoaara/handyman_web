"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  clearAuthError,
  loginWithPassword,
  selectAuthError,
  selectAuthStatus,
  selectHomePath,
} from "../redux/slices/authSlice";
import Button from "../components/ui/Button";

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const homePath = useAppSelector(selectHomePath);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    // force a new random image on every load
    setImageUrl(`https://picsum.photos/1200/900?random=${Date.now()}`);
  }, []);

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
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-5 bg-(--color-bg) text-(--color-text)">
      {/* LEFT: Login Section (2/5) */}
      <div className="col-span-1 lg:col-span-2 flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded border border-(--color-border) bg-(--color-surface) p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold">Handyman</h1>
            <p className="mt-1 text-sm text-(--color-text-muted)">
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
                loginWithPassword({ email: trimmedEmail, password }),
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
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-4 py-2 outline-none focus:border-(--color-accent)"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) dispatch(clearAuthError());
              }}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-4 py-2 outline-none focus:border-(--color-accent)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) dispatch(clearAuthError());
              }}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 font-medium"
              variant="primary"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>
          </form>

          {error && (
            <p className="mt-4 text-center text-sm text-(--color-accent)">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT: Image Section (3/5) */}
      <div className="relative hidden lg:col-span-3 lg:block">
        {imageUrl && (
          <img
            src={imageUrl}
            alt="Random background"
            className="h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/20" />
      </div>
    </div>
  );
}
