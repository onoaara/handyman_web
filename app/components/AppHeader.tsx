"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logout } from "../features/auth/authSlice";
import { selectThemeMode, toggleTheme } from "../features/theme/themeSlice";

type AppHeaderProps = {
  title: string;
};

export default function AppHeader({ title }: AppHeaderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userEmail = useAppSelector((state) => state.auth.user?.email);
  const themeMode = useAppSelector(selectThemeMode);

  return (
    <header className="mb-6 flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold tracking-wide text-[var(--color-text)]">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-pressed={themeMode === "dark"}
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] hover:opacity-90"
          onClick={() => dispatch(toggleTheme())}
        >
          <span className="h-5 w-9 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] p-0.5">
            <span
              className={`block h-4 w-4 rounded-full bg-[var(--color-accent)] transition-transform ${
                themeMode === "dark" ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </span>
          <span>{themeMode === "dark" ? "Dark" : "Light"}</span>
        </button>

        {userEmail ? (
          <span className="text-sm text-[var(--color-text-muted)]">
            {userEmail}
          </span>
        ) : null}

        <button
          type="button"
          disabled={isLoggingOut}
          className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-[var(--color-on-accent)] hover:opacity-90 disabled:opacity-60"
          onClick={async () => {
            if (isLoggingOut) return;
            setIsLoggingOut(true);
            try {
              await dispatch(logout()).unwrap();
              toast.success("Logged out");
              router.replace("/login");
            } catch (e) {
              const message =
                e instanceof Error ? e.message : "Failed to log out";
              toast.error(message);
            } finally {
              setIsLoggingOut(false);
            }
          }}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </header>
  );
}
