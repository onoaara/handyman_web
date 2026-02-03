"use client";

import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import clsx from "clsx";
import Button from "./Button";

interface PaginationProps {
  currentPage: number;
  totalCount: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (currentPage - 1) * pageSize + 1;

  if (totalCount === 0) return null;

  // Generate page numbers
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages,
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages,
        );
      }
    }
    return pages;
  };

  return (
    <div
      className={clsx(
        "flex items-center justify-between border-t border-(--color-border) px-5 py-3",
        className,
      )}
    >
      <div className="text-xs font-medium text-(--color-text)">
        Showing {startItem} of {totalCount} contacts
      </div>
      <div className="flex items-center border border-(--color-border) rounded">
        <Button
          variant="ghost"
          className="flex items-center cursor-pointer gap-1 px-2 py-2 rounded-none rounded-l text-xs font-medium text-(--color-text) hover:bg-(--color-bg) disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <FiArrowLeft className="h-3 w-3" />
          Previous
        </Button>

        <div className="flex items-center">
          {getPageNumbers().map((page, index) =>
            typeof page === "number" ? (
              <Button
                key={index}
                variant="ghost"
                onClick={() => onPageChange(page)}
                className={clsx(
                  "h-8 w-7 px-0 py-0 rounded-none text-xs font-medium cursor-pointer transition-colors border-x border-(--color-border)",
                  currentPage === page
                    ? "bg-(--color-bg) text-(--color-text)"
                    : "text-(--color-text-muted) hover:bg-(--color-bg) hover:text-(--color-text)",
                )}
              >
                {page}
              </Button>
            ) : (
              <span
                key={index}
                className="px-2 text-sm text-(--color-text-muted)"
              >
                ...
              </span>
            ),
          )}
        </div>

        <Button
          variant="ghost"
          className="flex items-center cursor-pointer gap-1 px-2 py-2 rounded-none rounded-r text-xs font-medium text-(--color-text) hover:bg-(--color-bg) disabled:cursor-not-allowed disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
          <FiArrowRight className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
