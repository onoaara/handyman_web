"use client";

import { useState } from "react";
import { toast } from "sonner";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";
import { useGetUsersQuery } from "../../../redux/api/usersApi";
import { filterUsersByRole } from "../../../redux/api/userRoles";

type CreateShopModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (shopData: {
    name: string;
    description: string;
    address: string;
    phone: string;
    location: string;
    athour: string;
    supervisor_id: string;
    is_active: boolean;
  }) => Promise<void>;
};

const CreateShopModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateShopModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    location: "",
    athour: "",
    supervisor_id: "",
    is_active: true,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { data: users = [] } = useGetUsersQuery();
  const handymen = filterUsersByRole(users, "handyman");
  const supervisors = filterUsersByRole(users, "supervisor");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.athour) {
      toast.error("Please select a handyman");
      return;
    }

    if (!formData.supervisor_id) {
      toast.error("Please select a supervisor");
      return;
    }

    setIsLoading(true);
    try {
      await onCreate(formData);
      toast.success("Shop created successfully");
      onClose();
      // Reset form
      setFormData({
        name: "",
        description: "",
        address: "",
        phone: "",
        location: "",
        athour: "",
        supervisor_id: "",
        is_active: true,
      });
    } catch (error) {
      toast.error("Failed to create shop");
      console.error("Create error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal size="lg" isOpen={isOpen} onClose={onClose} title="Create New Shop">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
              placeholder="Shop Name"
              required
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Handyman <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.athour}
              onChange={(e) => handleInputChange("athour", e.target.value)}
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
              required
            >
              <option value="">Select a handyman</option>
              {handymen.map((handyman) => (
                <option key={handyman.id} value={handyman.id}>
                  {handyman.name || handyman.email}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Supervisor <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.supervisor_id}
              onChange={(e) =>
                handleInputChange("supervisor_id", e.target.value)
              }
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
              required
            >
              <option value="">Select a supervisor</option>
              {supervisors.map((supervisor) => (
                <option key={supervisor.id} value={supervisor.id}>
                  {supervisor.name || supervisor.email}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
              placeholder="Shop Description"
              rows={3}
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
              placeholder="Address"
            />
          </div>

          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium text-(--color-text)">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className="w-full rounded border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
              placeholder="Phone Number"
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
              placeholder="City, State"
            />
          </div>

          <div className="sm:col-span-1 flex items-center pt-6">
            <label className="flex items-center space-x-2 text-sm font-medium text-(--color-text) cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  handleInputChange("is_active", e.target.checked)
                }
                className="h-4 w-4 rounded border-(--color-border) text-(--color-accent) focus:ring-(--color-accent)"
              />
              <span>Active</span>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Shop"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateShopModal;
