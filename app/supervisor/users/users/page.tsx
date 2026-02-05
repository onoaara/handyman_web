"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import UsersTable from "../../../components/UsersTable";
import EditUserModal from "../../../components/modals/EditUserModal";
import CreateUserModal from "../../../components/modals/CreateUserModal";
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../redux/api/usersApi";
import { filterUsersByRole } from "../../../redux/api/userRoles";
import type { ApiUser } from "../../../redux/api/usersApi";
import Button from "@/app/components/ui/Button";

export default function SupervisorUsers() {
  const { data, isLoading, isFetching, error, refetch } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const users = filterUsersByRole(data ?? [], "user");

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
    try {
      await updateUser({
        id: userId,
        updates: {
          name: updates.name,
          location: updates.location,
          role:
            (updates.app_metadata?.role as string) ||
            (updates.user_metadata?.role as string),
        },
      }).unwrap();
      toast.success("User updated successfully");
      await refetch();
    } catch (error) {
      const message =
        error && typeof error === "object" && "error" in error
          ? String(
              (error as { error?: unknown }).error ?? "Failed to update user",
            )
          : "Failed to update user";
      toast.error(message);
      throw error;
    }
  };

  const handleCreateNewUser = async (userData: {
    name: string;
    email: string;
    location: string;
    role: string;
    password: string;
  }) => {
    try {
      await createUser(userData).unwrap();
      toast.success("User created successfully");
      await refetch();
    } catch (error) {
      const message =
        error && typeof error === "object" && "error" in error
          ? String(
              (error as { error?: unknown }).error ?? "Failed to create user",
            )
          : "Failed to create user";
      toast.error(message);
      throw error;
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Users</h2>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          {isLoading || isFetching ? "Loading..." : " "}
        </p>
        <Button
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
                        "Failed to refresh users",
                    )
                  : "Failed to refresh users";
              toast.error(message);
            }
          }}
          variant="outline"
          disabled={isLoading || isFetching}
        >
          Refresh
        </Button>
      </div>

      {errorMessage ? (
        <div className="mb-4 rounded border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)]">
          {errorMessage}
        </div>
      ) : null}

      <UsersTable
        title="Users"
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
