"use client";

import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiDownload,
  FiInbox,
  FiLoader,
  FiPrinter,
  FiUpload,
} from "react-icons/fi";
import clsx from "clsx";
import Button from "./ui/Button";
import Pagination from "./ui/Pagination";
import Checkbox from "./ui/Checkbox";
import { PageHeaderTitle, PageHeaderSubtitle } from "./ui/PageHeader";

export interface Column<T> {
  key: keyof T | string;
  header: React.ReactNode;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  title?: string;
  subtitle?: string;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: Set<string>) => void;
  getRowId?: (item: T) => string;
  showSearch?: boolean;
  showFilter?: boolean;
  showExport?: boolean;
  onExport?: () => void;
  onImport?: () => void;
  exportVariant?: "primary" | "secondary" | "outline";
  actions?: React.ReactNode;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  onScan?: () => void;
  isScanLoading?: boolean;
}

export default function DataTable<
  T extends { id?: string; key?: string | number },
>({
  data,
  columns,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  title = "Data",
  subtitle = "Manage your data here.",
  selectable = true,
  onSelectionChange,
  getRowId = (item) => item.id ?? String(item.key ?? Math.random()),
  showSearch = true,
  showFilter = true,
  showExport = true,
  onExport,
  onImport,
  exportVariant = "primary",
  actions,
  searchPlaceholder = "Search",
  onSearch,
  onScan,
  isScanLoading = false,
}: DataTableProps<T>) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSelectAll = () => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map(getRowId)));
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Notify parent of selection changes
  React.useEffect(() => {
    onSelectionChange?.(selectedIds);
  }, [selectedIds, onSelectionChange]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <div className="mt-4 rounded border border-(--color-border) bg-(--color-surface) shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-(--color-border) px-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <PageHeaderTitle>
            {title}{" "}
            <span className="ml-2 rounded bg-(--color-bg) px-2 py-0.5 text-xs font-medium text-(--color-text-muted)">
              {totalCount}
            </span>
          </PageHeaderTitle>
          <div className="mt-1">
            <PageHeaderSubtitle>{subtitle}</PageHeaderSubtitle>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {showFilter && (
            <Button
              variant="outline"
              className="p-2 h-auto text-(--color-text-muted) hover:text-(--color-text)"
            >
              <FiFilter className="h-3 w-3" />
            </Button>
          )}
          {showSearch && (
            <div className="relative grow md:grow-0">
              <FiSearch className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-(--color-text-muted)" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={handleSearchChange}
                className="h-8 w-full md:w-64 rounded border border-(--color-border) bg-(--color-bg) pl-9 pr-4 text-xs text-(--color-text) placeholder-(--color-text-muted) focus:border-(--color-accent) focus:outline-none focus:ring-1 focus:ring-(--color-accent)"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {showExport && onExport && (
              <Button
                variant={exportVariant}
                className="py-1.5! whitespace-nowrap text-xs"
                onClick={onExport}
              >
                <FiDownload className="mr-2 h-3 w-3" />
                Export Report
              </Button>
            )}
            {onImport && (
              <Button
                onClick={onImport}
                className="text-white flex items-center gap-2 py-1.5! text-xs whitespace-nowrap"
              >
                <FiUpload className="w-3 h-3" />
                Import Excel
              </Button>
            )}
            {actions}
            {onScan && (
              <Button
                className="py-1.5! text-xs"
                onClick={onScan}
                disabled={isScanLoading}
              >
                {isScanLoading ? (
                  <span className="flex items-center gap-2">
                    <FiLoader className="h-3 w-3 animate-spin" />
                    <span>Scan</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <FiPrinter className="h-3 w-3" />
                    <span>Scan</span>
                  </span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-(--color-text)">
          <thead className="bg-(--color-surface) text-xs font-medium uppercase text-(--color-text-muted)">
            <tr>
              {selectable && (
                <th className="px-4 py-4 w-10">
                  <div className="flex justify-center">
                    <Checkbox
                      checked={
                        selectedIds.size === data.length && data.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-4 text-xs whitespace-nowrap"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-(--color-border)">
            {data.length === 0 ? (
              <tr>
                <td
                  className="px-4 py-8 text-center text-xs text-(--color-text-muted)"
                  colSpan={columns.length + (selectable ? 1 : 0)}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-(--color-bg) text-(--color-text-muted)">
                      <FiInbox className="h-5 w-5" />
                    </div>
                    <div className="text-xs font-medium text-(--color-text)">
                      No data available
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const rowId = getRowId(item);
                return (
                  <tr
                    key={rowId}
                    className={clsx(
                      "hover:bg-(--color-border)/20",
                      index % 2 === 0
                        ? "bg-(--color-bg)"
                        : "bg-(--color-surface)",
                    )}
                  >
                    {selectable && (
                      <td className="px-4 py-2 w-10">
                        <div className="flex justify-center">
                          <Checkbox
                            checked={selectedIds.has(rowId)}
                            onChange={() => toggleSelect(rowId)}
                          />
                        </div>
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className="px-4 py-2 text-xs whitespace-nowrap"
                      >
                        {column.render
                          ? column.render(item[column.key as keyof T], item)
                          : String(item[column.key as keyof T] || "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={onPageChange}
      />
    </div>
  );
}
