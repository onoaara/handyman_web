"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <h2 className="mb-6 text-lg font-semibold text-[var(--color-text)]">
        Handyman Admin
      </h2>

      <nav className="space-y-2">
        <Link
          href="/admin/dashboard"
          className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
            pathname === "/admin/dashboard"
              ? "bg-[var(--color-accent)] font-semibold text-[var(--color-on-accent)]"
              : "text-[var(--color-text)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
          }`}
        >
          Dashboard
        </Link>

        <details className="group">
          <summary className="cursor-pointer list-none rounded-lg px-4 py-2 text-sm text-[var(--color-text)] transition-colors hover:bg-[var(--color-bg)]">
            Users
          </summary>

          <div className="mt-2 ml-4 space-y-1">
            <Link
              href="/admin/users/handymen"
              className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                pathname === "/admin/users/handymen"
                  ? "bg-[var(--color-accent)] font-semibold text-[var(--color-on-accent)]"
                  : "text-[var(--color-text)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
              }`}
            >
              Handymen
            </Link>

            <Link
              href="/admin/users/users"
              className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                pathname === "/admin/users/users"
                  ? "bg-[var(--color-accent)] font-semibold text-[var(--color-on-accent)]"
                  : "text-[var(--color-text)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
              }`}
            >
              Users
            </Link>

            <Link
              href="/admin/users/supervisors"
              className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                pathname === "/admin/users/supervisors"
                  ? "bg-[var(--color-accent)] font-semibold text-[var(--color-on-accent)]"
                  : "text-[var(--color-text)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
              }`}
            >
              Supervisors
            </Link>

            <Link
              href="/admin/users/all-users"
              className={`block rounded-lg px-4 py-2 text-sm transition-colors ${
                pathname === "/admin/users/all-users"
                  ? "bg-[var(--color-accent)] font-semibold text-[var(--color-on-accent)]"
                  : "text-[var(--color-text)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
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
              ? "bg-[var(--color-accent)] font-semibold text-[var(--color-on-accent)]"
              : "text-[var(--color-text)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
          }`}
        >
          Services
        </Link>
      </nav>
    </aside>
  );
}

