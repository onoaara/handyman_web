"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Modal from "./Modal";
import type { ApiUser } from "../features/users/usersApi";

type EditUserModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: ApiUser | null;
  onSave: (userId: string, updates: Partial<ApiUser>) => Promise<void>;
};

const EditUserModal = ({
  isOpen,
  onClose,
  user,
  onSave,
}: EditUserModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    role: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      // Extract role from user metadata
      const appMetadata =
        user.app_metadata && typeof user.app_metadata === "object"
          ? (user.app_metadata as Record<string, unknown>)
          : null;
      const userMetadata =
        user.user_metadata && typeof user.user_metadata === "object"
          ? (user.user_metadata as Record<string, unknown>)
          : null;

      const role = appMetadata?.role ?? userMetadata?.role ?? "";

      setFormData({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
        role: typeof role === "string" ? role : "",
      });
    }
  }, [user, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const updates: Partial<ApiUser> = {
        name: formData.name || null,
        email: formData.email,
        location: formData.location || null,
        user_metadata: {
          ...user.user_metadata,
          role: formData.role || undefined,
        },
      };

      await onSave(user.id, updates);
      toast.success("User updated successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update user");
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit User">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
              placeholder="Enter name"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
              placeholder="Enter email"
              required
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
              placeholder="Enter location"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
              <option value="handyman">Handyman</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-(--color-border) bg-(--color-bg) px-4 py-2 text-sm font-medium text-(--color-text) hover:opacity-90 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="rounded-lg bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-on-accent) hover:opacity-90 disabled:opacity-60"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
