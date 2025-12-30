"use client";

import { useState, useMemo, useEffect } from "react";
import type { ApiUser } from "../features/users/usersApi";
import EditUserButton from "./EditUserButton";

type UsersTableProps = {
  title: string;
  users: ApiUser[];
  itemsPerPage?: number;
  onEdit?: (user: ApiUser) => void;
  onCreate?: () => void;
};

const normalizeRole = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : null;

const extractRolesFromUser = (user: ApiUser): string[] => {
  const appMetadata =
    user.app_metadata && typeof user.app_metadata === "object"
      ? (user.app_metadata as Record<string, unknown>)
      : null;
  const userMetadata =
    user.user_metadata && typeof user.user_metadata === "object"
      ? (user.user_metadata as Record<string, unknown>)
      : null;

  const maybeRole =
    normalizeRole(appMetadata?.role) ?? normalizeRole(userMetadata?.role);
  if (maybeRole) return [maybeRole];

  const maybeRoles = appMetadata?.roles ?? userMetadata?.roles;
  if (Array.isArray(maybeRoles)) {
    const roles = maybeRoles.map(normalizeRole).filter((r): r is string => !!r);
    if (roles.length) return roles;
  }

  const singleRole = normalizeRole(maybeRoles);
  return singleRole ? [singleRole] : [];
};

const getPrimaryRole = (user: ApiUser) => extractRolesFromUser(user)[0] ?? null;

const formatDateTime = (value: unknown) => {
  if (typeof value !== "string") return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

const UsersTable = ({
  title,
  users,
  itemsPerPage = 10,
  onEdit,
  onCreate,
}: UsersTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / itemsPerPage);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  const validPage =
    totalPages > 0 && currentPage > totalPages ? 1 : currentPage;
  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedUsers = useMemo(
    () => users.slice(startIndex, endIndex),
    [users, startIndex, endIndex],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <span className="text-sm font-semibold text-[var(--color-text)]">
          {title}
        </span>
        <div className="flex items-center gap-2">
          {onCreate && (
            <button
              type="button"
              onClick={onCreate}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] hover:opacity-90"
            >
              Create
            </button>
          )}
          <span className="text-sm text-[var(--color-text-muted)]">
            {users.length} total
            {totalPages > 1 && ` • Page ${validPage} of ${totalPages}`}
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-[var(--color-bg)] text-[var(--color-text)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Email Verified</th>
              <th className="px-4 py-3 font-semibold">Phone Verified</th>
              <th className="px-4 py-3 font-semibold">Last Sign In</th>
              <th className="px-4 py-3 font-semibold">Created</th>
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u, idx) => (
              <tr
                key={u.id ?? u.email ?? String(idx)}
                className="border-t border-[var(--color-border)]"
              >
                <td className="px-4 py-3 text-[var(--color-text)]">
                  {u.name || "—"}
                </td>
                <td className="px-4 py-3 text-[var(--color-text)]">
                  {typeof u.email === "string" ? u.email : "—"}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {u.location || "—"}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {getPrimaryRole(u) ?? "—"}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {u.email_verified === true ? (
                    <span className="text-green-600">✓ Yes</span>
                  ) : u.email_verified === false ? (
                    <span className="text-red-600">✗ No</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {u.phone_verified === true ? (
                    <span className="text-green-600">✓ Yes</span>
                  ) : u.phone_verified === false ? (
                    <span className="text-red-600">✗ No</span>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {formatDateTime(u.last_sign_in_at)}
                </td>
                <td className="px-4 py-3 text-[var(--color-text-muted)]">
                  {formatDateTime(u.created_at)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-text-muted)]">
                  {typeof u.id === "string" ? u.id : "—"}
                </td>
                <td className="px-4 py-3">
                  <EditUserButton user={u} onEdit={onEdit} />
                </td>
              </tr>
            ))}

            {paginatedUsers.length === 0 ? (
              <tr className="border-t border-[var(--color-border)]">
                <td
                  className="px-4 py-6 text-center text-[var(--color-text-muted)]"
                  colSpan={10}
                >
                  No users found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-[var(--color-border)] px-4 py-3">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={validPage === 1}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-[var(--color-text-muted)]">
            Showing {(validPage - 1) * itemsPerPage + 1}–
            {Math.min(validPage * itemsPerPage, users.length)} of {users.length}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={validPage === totalPages}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 text-sm text-[var(--color-text)] hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
