"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import UsersTable from "../../../components/UsersTable";
import { useGetUsersQuery } from "../../../features/users/usersApi";

export default function AdminAllUsers() {
  const { data, isLoading, isFetching, error, refetch } = useGetUsersQuery();
  const users = data ?? [];

  const errorMessage =
    error && typeof error === "object" && "error" in error
      ? String((error as { error?: unknown }).error ?? "Failed to load users")
      : error
      ? "Failed to load users"
      : null;

  const errorHint =
    error &&
    typeof error === "object" &&
    "hint" in error &&
    typeof (error as { hint?: unknown }).hint === "string"
      ? (error as { hint: string }).hint
      : null;

  useEffect(() => {
    if (!errorMessage) return;
    toast.error(errorMessage);
    if (errorHint) {
      // Show hint after a short delay so both messages are visible
      setTimeout(() => toast.info(errorHint), 500);
    }
  }, [errorMessage, errorHint]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">All Users</h2>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          {isLoading || isFetching ? "Loading..." : " "}
        </p>
        <button
          type="button"
          onClick={async () => {
            try {
              await refetch().unwrap();
              toast.success("Users refreshed");
            } catch (e) {
              const message =
                e && typeof e === "object" && "error" in e
                  ? String(
                      (e as { error?: unknown }).error ??
                        "Failed to refresh users"
                    )
                  : "Failed to refresh users";
              toast.error(message);
            }
          }}
          className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] hover:opacity-90 disabled:opacity-60"
          disabled={isLoading || isFetching}
        >
          Refresh
        </button>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)]">
          <p className="font-medium text-[var(--color-accent)]">
            {errorMessage}
          </p>
          {errorHint ? (
            <p className="mt-2 text-[var(--color-text-muted)]">{errorHint}</p>
          ) : null}
        </div>
      ) : null}

      <UsersTable title="All Users" users={users} />
    </div>
  );
}
