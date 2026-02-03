"use client";

import { useState, useMemo, useEffect } from "react";
import type { ApiUser } from "../redux/api/usersApi";
import EditUserButton from "./EditUserButton";
import DataTable, { Column } from "./DataTable";
import Button from "./ui/Button";

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

  const columns: Column<ApiUser>[] = [
    {
      key: "name",
      header: "Name",
      render: (value) => (value as string) || "—",
    },
    {
      key: "email",
      header: "Email",
      render: (value) => (typeof value === "string" ? value : "—"),
    },
    {
      key: "location",
      header: "Location",
      render: (value) => (value as string) || "—",
    },
    {
      key: "role",
      header: "Role",
      render: (_, user) => getPrimaryRole(user) ?? "—",
    },
    {
      key: "email_verified",
      header: "Email Verified",
      render: (value) =>
        value === true ? (
          <span className="text-green-600 dark:text-green-400">✓ Yes</span>
        ) : value === false ? (
          <span className="text-red-600 dark:text-red-400">✗ No</span>
        ) : (
          "—"
        ),
    },
    {
      key: "phone_verified",
      header: "Phone Verified",
      render: (value) =>
        value === true ? (
          <span className="text-green-600 dark:text-green-400">✓ Yes</span>
        ) : value === false ? (
          <span className="text-red-600 dark:text-red-400">✗ No</span>
        ) : (
          "—"
        ),
    },
    {
      key: "last_sign_in_at",
      header: "Last Sign In",
      render: (value) => formatDateTime(value),
    },
    {
      key: "created_at",
      header: "Created",
      render: (value) => formatDateTime(value),
    },
    {
      key: "id",
      header: "ID",
      render: (value) => (
        <span className="font-mono text-xs text-(--color-text-muted)">
          {typeof value === "string" ? value : "—"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      render: (_, user) => <EditUserButton user={user} onEdit={onEdit} />,
    },
  ];

  return (
    <DataTable
      title={title}
      data={paginatedUsers}
      columns={columns}
      totalCount={users.length}
      currentPage={validPage}
      pageSize={itemsPerPage}
      onPageChange={setCurrentPage}
      actions={
        onCreate && (
          <Button onClick={onCreate} className="py-1.5! text-xs">
            Create
          </Button>
        )
      }
    />
  );
};

export default UsersTable;
