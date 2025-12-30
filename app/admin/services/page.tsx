"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "../../lib/supabaseClient";

type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  display_picture: string | null;
  createdAt: string | null;
};

const normalizeString = (value: unknown) =>
  typeof value === "string" && value.trim() ? value.trim() : null;

const normalizeNumber = (value: unknown) =>
  typeof value === "number" && Number.isFinite(value) ? value : null;

const normalizeService = (row: Record<string, unknown>): Service => {
  const id =
    normalizeString(row.id) ??
    normalizeString(row.service_id) ??
    normalizeString(row.uid) ??
    "";

  const name =
    normalizeString(row.name) ??
    normalizeString(row.title) ??
    normalizeString(row.service_name) ??
    "Untitled service";

  const description =
    normalizeString(row.description) ??
    normalizeString(row.details) ??
    normalizeString(row.service_description);

  const price =
    normalizeNumber(row.price) ??
    normalizeNumber(row.amount) ??
    normalizeNumber(row.cost);

  const createdAt = normalizeString(row.created_at);
  const display_picture = normalizeString(row.display_picture);

  return { id, name, description, price, display_picture, createdAt };
};

const formatPrice = (value: number | null) => {
  if (value === null) return null;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "NGN",
    }).format(value);
  } catch {
    return String(value);
  }
};

const formatDateTime = (value: string | null) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftPrice, setDraftPrice] = useState("");
  const [draftImage, setDraftImage] = useState<File | null>(null);
  const [draftImagePreview, setDraftImagePreview] = useState<string | null>(
    null
  );
  const [isCreating, setIsCreating] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const serviceCount = services.length;

  const cards = useMemo(
    () =>
      services.map((s) => ({
        ...s,
        formattedPrice: formatPrice(s.price),
        formattedCreatedAt: formatDateTime(s.createdAt),
      })),
    [services]
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      setDraftImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDraftImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (
    file: File,
    serviceId: string
  ): Promise<string | null> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${serviceId}-${Date.now()}.${fileExt}`;
      const filePath = `service-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("service-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        // If bucket doesn't exist, try to create it or use public URL
        console.error("Upload error:", uploadError);
        toast.error(
          "Failed to upload image. Please ensure 'service-images' storage bucket exists."
        );
        return null;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("service-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image");
      return null;
    }
  };

  const loadServices = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);

    if (error) {
      // Check if it's a "table not found" error
      const isTableNotFound =
        error.code === "42P01" ||
        error.code === "PGRST116" ||
        error.message.includes("does not exist") ||
        error.message.includes("schema cache");

      if (isTableNotFound) {
        const message =
          "Services table does not exist. Please create the 'services' table in your Supabase database.";
        setErrorMessage(message);
        // Don't show toast for table not found to avoid spam
        setServices([]);
        setIsLoading(false);
        return;
      }

      setErrorMessage(error.message);
      toast.error(error.message);
      setServices([]);
      setIsLoading(false);
      return;
    }

    const rows = Array.isArray(data) ? data : [];
    const nextServices = rows
      .filter((row): row is Record<string, unknown> => !!row)
      .map((row) => normalizeService(row))
      .filter((s) => s.id);

    setServices(nextServices);
    setIsLoading(false);
  };

  useEffect(() => {
    void loadServices();
  }, []);

  const createService = async () => {
    const name = draftName.trim();
    if (!name) {
      toast.info("Enter a service name");
      return;
    }

    const description = draftDescription.trim() || null;
    const priceValue = draftPrice.trim() === "" ? 0 : Number(draftPrice.trim());

    if (!Number.isFinite(priceValue) || priceValue < 0) {
      toast.error("Price must be a valid number");
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);

    // First create the service to get the ID
    const payload: Record<string, unknown> = {
      name,
      description,
      price: priceValue,
    };

    const { data: serviceData, error: insertError } = await supabase
      .from("services")
      .insert(payload)
      .select("*")
      .single();

    if (insertError) {
      const isTableNotFound =
        insertError.code === "42P01" ||
        insertError.code === "PGRST116" ||
        insertError.message.includes("does not exist") ||
        insertError.message.includes("schema cache");

      if (isTableNotFound) {
        toast.error(
          "Services table does not exist. Please create the 'services' table in your Supabase database."
        );
      } else {
        toast.error(insertError.message);
      }
      setIsCreating(false);
      return;
    }

    // Upload image if provided
    let imageUrl: string | null = null;
    if (draftImage && serviceData?.id) {
      imageUrl = await uploadImage(draftImage, serviceData.id);
      if (imageUrl) {
        // Update service with image URL
        await supabase
          .from("services")
          .update({ display_picture: imageUrl })
          .eq("id", serviceData.id);
      }
    }

    await loadServices();
    toast.success("Service created");
    resetForm();
  };

  const updateService = async () => {
    if (!editingService) return;

    const name = draftName.trim();
    if (!name) {
      toast.info("Enter a service name");
      return;
    }

    const description = draftDescription.trim() || null;
    const priceValue = draftPrice.trim() === "" ? 0 : Number(draftPrice.trim());

    if (!Number.isFinite(priceValue) || priceValue < 0) {
      toast.error("Price must be a valid number");
      return;
    }

    setIsCreating(true);
    setErrorMessage(null);

    const updatePayload: Record<string, unknown> = {
      name,
      description,
      price: priceValue,
    };

    // Upload new image if provided
    if (draftImage) {
      const imageUrl = await uploadImage(draftImage, editingService.id);
      if (imageUrl) {
        updatePayload.display_picture = imageUrl;
      }
    }

    const { error } = await supabase
      .from("services")
      .update(updatePayload)
      .eq("id", editingService.id);

    if (error) {
      toast.error(error.message);
      setIsCreating(false);
      return;
    }

    await loadServices();
    toast.success("Service updated");
    resetForm();
    setEditingService(null);
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    setIsDeleting(serviceId);
    const { error } = await supabase
      .from("services")
      .delete()
      .eq("id", serviceId);

    if (error) {
      toast.error(error.message);
      setIsDeleting(null);
      return;
    }

    await loadServices();
    toast.success("Service deleted");
    setIsDeleting(null);
  };

  const resetForm = () => {
    setDraftName("");
    setDraftDescription("");
    setDraftPrice("");
    setDraftImage(null);
    setDraftImagePreview(null);
    setShowCreate(false);
    setIsCreating(false);
  };

  const startEdit = (service: Service) => {
    setEditingService(service);
    setDraftName(service.name);
    setDraftDescription(service.description || "");
    setDraftPrice(service.price?.toString() || "");
    setDraftImagePreview(service.display_picture);
    setShowCreate(true);
  };

  const cancelEdit = () => {
    resetForm();
    setEditingService(null);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Services</h2>
          <p className="mt-1 text-sm text-(--color-text-muted)">
            {isLoading ? "Loading..." : `${serviceCount} service(s)`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="rounded-lg bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-on-accent) hover:opacity-90"
          >
            Create service
          </button>
          <button
            type="button"
            onClick={() => void loadServices()}
            disabled={isLoading}
            className="rounded-lg border border-(--color-border) bg-(--color-bg) px-4 py-2 text-sm text-(--color-text) hover:opacity-90 disabled:opacity-60"
          >
            Refresh
          </button>
        </div>
      </div>

      {showCreate ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              cancelEdit();
            }
          }}
        >
          <div
            className="w-full max-w-2xl rounded-xl border border-(--color-border) bg-(--color-surface) p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-(--color-text)">
                {editingService ? "Edit Service" : "Create Service"}
              </h3>
              <button
                type="button"
                onClick={cancelEdit}
                disabled={isCreating}
                className="rounded-lg p-1 text-(--color-text-muted) hover:bg-(--color-bg) disabled:opacity-50"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <label className="mb-1 block text-sm font-medium text-(--color-text)">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  className="w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
                  placeholder="e.g. Plumbing"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="mb-1 block text-sm font-medium text-(--color-text)">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={draftPrice}
                  onChange={(e) => setDraftPrice(e.target.value)}
                  className="w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
                  placeholder="e.g. 50.00"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-(--color-text)">
                  Description
                </label>
                <textarea
                  value={draftDescription}
                  onChange={(e) => setDraftDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
                  placeholder="Short description"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-(--color-text)">
                  Display Picture
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full rounded-lg border border-(--color-border) bg-(--color-bg) px-3 py-2 text-sm text-(--color-text) outline-none focus:border-(--color-accent)"
                />
                {draftImagePreview && (
                  <div className="mt-3">
                    <img
                      src={draftImagePreview}
                      alt="Preview"
                      className="h-40 w-40 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={cancelEdit}
                disabled={isCreating}
                className="rounded-lg border border-(--color-border) bg-(--color-bg) px-4 py-2 text-sm font-medium text-(--color-text) hover:opacity-90 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() =>
                  editingService ? void updateService() : void createService()
                }
                disabled={isCreating}
                className="rounded-lg bg-(--color-accent) px-4 py-2 text-sm font-medium text-(--color-on-accent) hover:opacity-90 disabled:opacity-60"
              >
                {isCreating
                  ? editingService
                    ? "Updating..."
                    : "Creating..."
                  : editingService
                  ? "Update"
                  : "Create"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {errorMessage ? (
        <div className="mb-6 rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-3 text-sm text-(--color-text)">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((s) => (
          <div
            key={s.id}
            className="relative rounded-xl border border-(--color-border) bg-(--color-surface) p-4"
          >
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(s)}
                className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                title="Edit service"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => void deleteService(s.id)}
                disabled={isDeleting === s.id}
                className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600 disabled:opacity-50"
                title="Delete service"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>

            {s.display_picture ? (
              <div className="mb-3">
                <img
                  src={s.display_picture}
                  alt={s.name}
                  className="h-40 w-full rounded-lg object-cover"
                />
              </div>
            ) : null}

            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-(--color-text)">
                  {s.name}
                </h3>
                {s.description ? (
                  <p className="mt-1 text-sm text-(--color-text-muted)">
                    {s.description}
                  </p>
                ) : null}
              </div>
              {s.formattedPrice ? (
                <span className="rounded-full border border-(--color-border) bg-(--color-bg) px-3 py-1 text-sm text-(--color-text)">
                  {s.formattedPrice}
                </span>
              ) : null}
            </div>

            {s.formattedCreatedAt ? (
              <p className="mt-4 text-xs text-(--color-text-muted)">
                Created {s.formattedCreatedAt}
              </p>
            ) : null}
          </div>
        ))}

        {!isLoading && cards.length === 0 ? (
          <div className="rounded-xl border border-(--color-border) bg-(--color-surface) px-4 py-10 text-center text-sm text-(--color-text-muted) sm:col-span-2 lg:col-span-3">
            No services found
          </div>
        ) : null}
      </div>
    </div>
  );
}
