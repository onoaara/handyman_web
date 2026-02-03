"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { selectThemeMode, toggleTheme } from "../redux/slices/themeSlice";
import Button from "./ui/Button";

type AppHeaderProps = {
  title?: string;
};

export default function AppHeader({ title }: AppHeaderProps) {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const userEmail = useAppSelector((state) => state.auth.user?.email);
  const themeMode = useAppSelector(selectThemeMode);

  return (
    <header
      id="header"
      className="flex items-center justify-between bg-[var(--color-surface)]"
    >
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold tracking-wide text-[var(--color-text)]">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          aria-pressed={themeMode === "dark"}
          variant="outline"
          className="gap-2 px-3 py-2 text-sm"
          onClick={() => dispatch(toggleTheme())}
        >
          <span className="h-5 w-9 rounded border border-[var(--color-border)] bg-[var(--color-bg)] p-0.5">
            <span
              className={`block h-4 w-4 rounded bg-[var(--color-accent)] transition-transform ${
                themeMode === "dark" ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </span>
          <span>{themeMode === "dark" ? "Dark" : "Light"}</span>
        </Button>

        {userEmail ? (
          <span className="text-sm text-[var(--color-text-muted)]">
            {userEmail}
          </span>
        ) : null}

        <Button
          type="button"
          disabled={isLoggingOut}
          variant="primary"
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
        </Button>
      </div>
    </header>
  );
}
