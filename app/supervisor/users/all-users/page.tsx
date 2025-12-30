"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import UsersTable from "../../../components/UsersTable";
import EditUserModal from "../../../components/EditUserModal";
import CreateUserModal from "../../../components/CreateUserModal";
import { useGetUsersQuery } from "../../../features/users/usersApi";
import type { ApiUser } from "../../../features/users/usersApi";

export default function SupervisorAllUsers() {
  const { data, isLoading, isFetching, error, refetch } = useGetUsersQuery();
  const allUsers = data ?? [];

  // Filter out admin users for supervisors
  const users = allUsers.filter((user) => {
    const appMetadata =
      user.app_metadata && typeof user.app_metadata === "object"
        ? (user.app_metadata as Record<string, unknown>)
        : null;
    const userMetadata =
      user.user_metadata && typeof user.user_metadata === "object"
        ? (user.user_metadata as Record<string, unknown>)
        : null;

    const role =
      (typeof appMetadata?.role === "string" &&
        appMetadata.role.trim().toLowerCase()) ||
      (typeof userMetadata?.role === "string" &&
        userMetadata.role.trim().toLowerCase()) ||
      null;

    return role !== "admin";
  });

  const errorMessage =
    error && typeof error === "object" && "error" in error
      ? String((error as { error?: unknown }).error ?? "Failed to load users")
      : error
      ? "Failed to load users"
      : null;

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ApiUser | null>(null);

  useEffect(() => {
    if (!errorMessage) return;
    toast.error(errorMessage);
  }, [errorMessage]);

  const handleEditUser = (user: ApiUser) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleCreateUser = () => {
    setIsCreateModalOpen(true);
  };

  const handleSaveUser = async (userId: string, updates: Partial<ApiUser>) => {
    // TODO: Implement user update API call
    console.log("Saving user:", userId, updates);
    // For now, just refresh the data
    await refetch();
  };

  const handleCreateNewUser = async (userData: {
    name: string;
    email: string;
    location: string;
    role: string;
    password: string;
  }) => {
    // TODO: Implement user creation API call
    console.log("Creating user:", userData);
    // For now, just refresh the data
    await refetch();
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">All Users</h2>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-(--color-text-muted)">
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
          className="border-ar(--color-border) rounded-lg border bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) hover:opacity-90 disabled:opacity-60"
          disabled={isLoading || isFetching}
        >
          Refresh
        </button>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded-lg border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text)">
          {errorMessage}
        </div>
      ) : null}

      <UsersTable
        title="All Users"
        users={users}
        onEdit={handleEditUser}
        onCreate={handleCreateUser}
      />

      <EditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleSaveUser}
      />

      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateNewUser}
      />
    </div>
  );
}
