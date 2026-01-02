"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-(--color-border) bg-(--color-surface) p-4">
      <h2 className="mb-6 text-lg font-semibold text-(--color-text)">
        Handyman Admin
      </h2>

      <nav className="space-y-2">
        <Link
          href="/admin/dashboard"
          className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
            pathname === "/admin/dashboard"
              ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
              : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
          }`}
        >
          Dashboard
        </Link>

        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg px-4 py-2 text-sm text-(--color-text) transition-colors hover:bg-(--color-bg)">
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
              href="/admin/users/handymen"
              className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                pathname === "/admin/users/handymen"
                  ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
                  : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
              }`}
            >
              Handymen
            </Link>

            <Link
              href="/admin/users/users"
              className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                pathname === "/admin/users/users"
                  ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
                  : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
              }`}
            >
              Users
            </Link>

            <Link
              href="/admin/users/supervisors"
              className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                pathname === "/admin/users/supervisors"
                  ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
                  : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
              }`}
            >
              Supervisors
            </Link>

            <Link
              href="/admin/users/all-users"
              className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                pathname === "/admin/users/all-users"
                  ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
                  : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
              }`}
            >
              All Users
            </Link>
          </div>
        </details>

        <Link
          href="/admin/services"
          className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
            pathname === "/admin/services"
              ? "bg-(--color-accent) font-semibold text-(--color-on-accent)"
              : "text-(--color-text) hover:bg-(--color-bg) hover:text-(--color-text)"
          }`}
        >
          Services
        </Link>

        <Link
          href="/admin/settings"
          className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
            pathname === "/admin/settings"
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
