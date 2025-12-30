"use client";

import { useAppSelector } from "../../hooks";

export default function SupervisorDashboard() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[var(--color-text)]">
              Welcome back, Supervisor!
            </h1>
            <p className="mt-2 text-[var(--color-text-muted)]">
              Monitor your team's performance and manage service requests.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="h-16 w-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
              <span className="text-2xl font-bold text-[var(--color-on-accent)]">
                {user?.email?.charAt(0).toUpperCase() || "S"}
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-[var(--color-text-muted)]">
                My Team
              </p>
              <p className="text-2xl font-bold text-[var(--color-text)]">24</p>
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
                Completed Today
              </p>
              <p className="text-2xl font-bold text-[var(--color-text)]">12</p>
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
                Pending Assignments
              </p>
              <p className="text-2xl font-bold text-[var(--color-text)]">8</p>
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
                Team Rating
              </p>
              <p className="text-2xl font-bold text-[var(--color-text)]">4.8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Performance & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Team Performance */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-4">
            Team Performance
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-[var(--color-accent)] flex items-center justify-center">
                  <span className="text-sm font-medium text-[var(--color-on-accent)]">
                    JD
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    John Doe
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Plumber
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--color-text)]">
                  15 jobs
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +3 today
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">AS</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    Alice Smith
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Electrician
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--color-text)]">
                  12 jobs
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  +2 today
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">MR</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--color-text)]">
                    Mike Ross
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Carpenter
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-[var(--color-text)]">
                  8 jobs
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-400">
                  +1 today
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
                  Assign Job
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Assign a new service request
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  View Reports
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Check team performance
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
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-[var(--color-text)]">
                  Team Chat
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Communicate with your team
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
