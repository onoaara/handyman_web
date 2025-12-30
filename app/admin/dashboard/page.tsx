"use client";

import { useAppSelector } from "../../hooks";

export default function AdminDashboard() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)]">
              Welcome back, Admin!
            </h1>
            <p className="mt-2 text-[var(--color-text-muted)]">
              Here's what's happening with your handyman management system
              today.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-16 w-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
              <span className="text-2xl font-bold text-[var(--color-on-accent)]">
                {user?.email?.charAt(0).toUpperCase() || "A"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-blue-600 dark:text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                Total Users
              </p>
              <p className="text-2xl font-bold text-[var(--color-text)]">
                1,234
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-green-600 dark:text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                Active Services
              </p>
              <p className="text-2xl font-bold text-[var(--color-text)]">89</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-yellow-600 dark:text-yellow-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                Pending Requests
              </p>
              <p className="text-2xl font-bold text-[var(--color-text)]">23</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-purple-600 dark:text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                This Month
              </p>
              <p className="text-2xl font-bold text-[var(--color-text)]">
                +12%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            Recent Activity
          </h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                <span className="text-sm font-medium text-[var(--color-on-accent)]">
                  JD
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[var(--color-text)]">
                  <span className="font-medium">John Doe</span> completed a
                  plumbing service
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  2 hours ago
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">AS</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[var(--color-text)]">
                  <span className="font-medium">Alice Smith</span> registered as
                  a new handyman
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  4 hours ago
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                <span className="text-sm font-medium text-white">MR</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-[var(--color-text)]">
                  <span className="font-medium">Mike Ross</span> submitted a
                  service request
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  6 hours ago
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            Quick Actions
          </h2>
          <div className="grid gap-3">
            <button className="flex items-center space-x-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-left hover:bg-[var(--color-surface)] transition-colors">
              <div className="h-10 w-10 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-[var(--color-on-accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  Add New User
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Create a new user account
                </p>
              </div>
            </button>

            <button className="flex items-center space-x-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-left hover:bg-[var(--color-surface)] transition-colors">
              <div className="h-10 w-10 rounded-lg bg-green-500 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  View Reports
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Check system analytics
                </p>
              </div>
            </button>

            <button className="flex items-center space-x-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-4 text-left hover:bg-[var(--color-surface)] transition-colors">
              <div className="h-10 w-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  System Settings
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Configure system preferences
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
