"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SupervisorSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-(--color-border) bg-(--color-surface) p-4">
      <h2 className="mb-6 text-lg font-semibold text-(--color-text)">
        Handyman Supervisor
      </h2>

      <nav className="space-y-2">
        <Link
          href="/supervisor/dashboard"
          className={`block rounded px-4 py-2 text-sm transition-colors ${
            pathname === "/supervisor/dashboard"
              ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
              : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
          }`}
        >
          Dashboard
        </Link>

        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded px-4 py-2 text-sm text-(--color-text) transition-colors hover:bg-(--color-bg)">
            <span>Users</span>

            {/* Chevron */}
            <svg
              className="h-4 w-4 transition-transform duration-200 group-open:rotate-180"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </summary>

          <div className="mt-2 ml-4 space-y-1">
            <Link
              href="/supervisor/users/handymen"
              className={`block rounded px-4 py-2 text-sm transition-colors ${
                pathname === "/supervisor/users/handymen"
                  ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
                  : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
              }`}
            >
              Handymen
            </Link>

            <Link
              href="/supervisor/users/users"
              className={`block rounded px-4 py-2 text-sm transition-colors ${
                pathname === "/supervisor/users/users"
                  ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
                  : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
              }`}
            >
              Users
            </Link>

            <Link
              href="/supervisor/users/all-users"
              className={`block rounded px-4 py-2 text-sm transition-colors ${
                pathname === "/supervisor/users/all-users"
                  ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
                  : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
              }`}
            >
              All Users
            </Link>
          </div>
        </details>

        <Link
          href="/supervisor/settings"
          className={`block rounded px-4 py-2 text-sm transition-colors ${
            pathname === "/supervisor/settings"
              ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
              : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
          }`}
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}
