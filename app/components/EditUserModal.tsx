"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Modal from "./Modal";
import type { ApiUser } from "../redux/api/usersApi";
import Button from "./ui/Button";

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
    email_verified: false,
    phone_verified: false,
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
        email_verified: user.email_verified || false,
        phone_verified: user.phone_verified || false,
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
          email_verified: formData.email_verified,
          phone_verified: formData.phone_verified,
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

  const handleInputChange = (field: string, value: string | boolean) => {
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
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
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
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
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
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
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
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="supervisor">Supervisor</option>
              <option value="handyman">Handyman</option>
              <option value="user">User</option>
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Email Verified
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.email_verified}
                onChange={(e) =>
                  handleInputChange("email_verified", e.target.checked)
                }
                className="h-4 w-4 rounded border-(--color-border) text-(--color-accent) focus:ring-(--color-accent)"
              />
              <span className="ml-2 text-sm text-(--color-text)">
                Email is verified
              </span>
            </div>
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Phone Verified
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.phone_verified}
                onChange={(e) =>
                  handleInputChange("phone_verified", e.target.checked)
                }
                className="h-4 w-4 rounded border-(--color-border) text-(--color-accent) focus:ring-(--color-accent)"
              />
              <span className="ml-2 text-sm text-(--color-text)">
                Phone is verified
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} variant="primary">
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
