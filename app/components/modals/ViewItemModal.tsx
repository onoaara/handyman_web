"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import { Item } from "@/app/redux/api/itemsApi";
import Button from "@/app/components/ui/Button";

type ViewItemModalProps = {
  isOpen: boolean;
  onClose: () => void;
  item: Item | null;
};

export default function ViewItemModal({
  isOpen,
  onClose,
  item,
}: ViewItemModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || !isOpen || !item) return null;

  const imageUrl = item.image_url || item.display_picture;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-lg bg-(--color-surface) p-6 shadow-xl border border-(--color-border)">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-(--color-text)">
            Item Details
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-(--color-text-muted) hover:bg-(--color-bg) hover:text-(--color-text)"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>

          <div>
            <h3 className="text-sm font-medium text-(--color-text-muted)">
              Name
            </h3>
            <p className="text-(--color-text) font-medium">{item.name}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-(--color-text-muted)">
              Price
            </h3>
            <p className="text-(--color-text)">
              {item.price ? `$${item.price.toFixed(2)}` : "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-(--color-text-muted)">
              Description
            </h3>
            <p className="text-sm text-(--color-text)">{item.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-(--color-text-muted)">
              Created At
            </h3>
            <p className="text-sm text-(--color-text)">
              {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>,
    document.body
  );
}
