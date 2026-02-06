"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetShopQuery } from "@/app/redux/api/shopsApi";
import { useGetServicesQuery, Service } from "@/app/redux/api/servicesApi";
import { useGetItemsQuery, Item } from "@/app/redux/api/itemsApi";
import DataTable, { Column } from "@/app/components/DataTable";
import Button from "@/app/components/ui/Button";
import ViewItemModal from "@/app/components/modals/ViewItemModal";

export default function ShopDetails() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const { data: shop, isLoading: isShopLoading } = useGetShopQuery(id);
  const { data: items = [], isLoading: isItemsLoading } = useGetItemsQuery({
    shop_id: id,
  });

  if (isShopLoading) {
    return (
      <div className="p-8 text-(--color-text)">Loading shop details...</div>
    );
  }

  if (!shop) {
    return (
      <div className="p-8 text-(--color-text)">
        <p>Shop not found</p>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mt-4"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const columns: Column<Item>[] = [
    {
      key: "image_url",
      header: "Image",
      render: (value, item) => {
        const imageUrl = item.image_url || item.display_picture;
        return (
          <div className="h-10 w-10 overflow-hidden rounded bg-gray-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </div>
        );
      },
    },
    {
      key: "name",
      header: "Name",
      render: (value, item) => (
        <div className="font-medium text-(--color-text)">{item.name}</div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (value, item) => (
        <div className="max-w-md truncate text-sm text-(--color-text-muted)">
          {item.description}
        </div>
      ),
    },
    {
      key: "price",
      header: "Price",
      render: (value, item) => (
        <div className="text-sm text-(--color-text)">
          {item.price ? `$${item.price.toFixed(2)}` : "N/A"}
        </div>
      ),
    },
    {
      key: "created_at",
      header: "Created At",
      render: (value) => (
        <span className="text-sm text-(--color-text-muted)">
          {new Date(value as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "id",
      header: "View",
      render: (_, item) => (
        <Button
          className="px-3 py-1 text-xs"
          variant="outline"
          onClick={() => {
            setSelectedItem(item);
            setIsViewModalOpen(true);
          }}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            ← Back
          </Button>
          <h1 className="text-2xl font-semibold text-(--color-text)">
            Shop Details
          </h1>
        </div>
      </div>

      <div className="grid gap-6 rounded-lg border border-(--color-border) bg-(--color-surface) p-6 lg:grid-cols-3">
        {/* Shop Image */}
        <div className="lg:col-span-1">
          <div className="aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
            {shop.image_url ? (
              <img
                src={shop.image_url}
                alt={shop.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                <svg
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Shop Info */}
        <div className="space-y-4 lg:col-span-2">
          <div>
            <h2 className="text-xl font-bold text-(--color-text)">
              {shop.name}
            </h2>
            <p className="text-(--color-text-muted)">{shop.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-(--color-text-muted)">
                Address
              </p>
              <p className="text-(--color-text)">{shop.address}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-(--color-text-muted)">
                Phone
              </p>
              <p className="text-(--color-text)">{shop.phone}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-(--color-text-muted)">
                Location
              </p>
              <p className="text-(--color-text)">{shop.location}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-(--color-text-muted)">
                Status
              </p>
              <span
                className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                  shop.is_active
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {shop.is_active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-(--color-text)">
          Shop Items ({items.length})
        </h2>
        <DataTable<Item>
          data={items}
          columns={columns}
          totalCount={items.length}
          currentPage={1}
          pageSize={items.length > 0 ? items.length : 10}
          onPageChange={() => {}}
        />
      </div>

      <ViewItemModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        item={selectedItem}
      />
    </div>
  );
}
