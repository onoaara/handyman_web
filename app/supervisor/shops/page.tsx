"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";
import DataTable, { Column } from "@/app/components/DataTable";
// import CreateShopModal from "@/app/components/modals/admin-modals/CreateShopModal";
// import EditShopModal from "@/app/components/modals/admin-modals/EditShopModal";
import {
  useGetShopsQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  Shop,
} from "@/app/redux/api/shopsApi";
import { useGetUsersQuery } from "@/app/redux/api/usersApi";

export default function Shops() {
  const { data: shops = [], isLoading, refetch } = useGetShopsQuery();
  const [createShop] = useCreateShopMutation();
  const [updateShop] = useUpdateShopMutation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Fetch users to map IDs to names
  const { data: users = [] } = useGetUsersQuery();

  const handleCreateShop = async (shopData: any) => {
    await createShop(shopData).unwrap();
    refetch();
  };

  const handleUpdateShop = async (id: string, shopData: Partial<Shop>) => {
    await updateShop({ id, data: shopData }).unwrap();
    refetch();
  };

  const handleEditClick = (shop: Shop) => {
    setSelectedShop(shop);
    setIsEditModalOpen(true);
  };

  const columns: Column<Shop>[] = [
    {
      key: "name",
      header: "Name",
      render: (value, item) => (
        <div>
          <div className="font-medium text-(--color-text)">{item.name}</div>
          <div className="text-xs text-(--color-text-muted)">
            {item.description}
          </div>
        </div>
      ),
    },
    {
      key: "athour",
      header: "Handyman",
      render: (value, item) => {
        const handyman = users.find((u) => u.id === item.athour);
        return (
          <div className="text-sm text-(--color-text)">
            {handyman?.name || handyman?.email || item.athour}
          </div>
        );
      },
    },
    {
      key: "location",
      header: "Location",
      render: (value, item) => (
        <div className="text-sm text-(--color-text)">
          {item.location || item.address}
        </div>
      ),
    },
    {
      key: "is_active",
      header: "Status",
      render: (value, item) => (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            item.is_active
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          }`}
        >
          {item.is_active ? "Active" : "Inactive"}
        </span>
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
      key: "actions",
      header: "Actions",
      render: (_, item) => (
        <Button
          variant="outline"
          // size="sm"
          onClick={() => handleEditClick(item)}
        >
          Edit
        </Button>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Shops</h2>
            <p className="mt-1 text-sm text-(--color-text-muted)">
              Manage shops and assign handymen
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" onClick={() => setIsCreateModalOpen(true)}>
              Create Shop
            </Button>
            <Button
              type="button"
              onClick={() => void refetch()}
              disabled={isLoading}
              variant="outline"
            >
              Refresh
            </Button>
          </div>
        </div>

        <DataTable
          data={shops}
          columns={columns}
          totalCount={shops.length}
          currentPage={1}
          pageSize={10}
          onPageChange={() => {}}
          selectable={true}
          onSelectionChange={setSelectedIds}
          getRowId={(item) => item.id}
        />
      </div>

      {/* <CreateShopModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateShop}
      /> */}

      {/* <EditShopModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        shop={selectedShop}
        onUpdate={handleUpdateShop}
      /> */}
    </>
  );
}
