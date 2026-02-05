"use client";

import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-xl",
    xl: "max-w-2xl",
  };

  const modalContent = (
    <div className="fixed inset-0 z-99 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-black/50 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="hidden sm:inline-block sm:h-screen sm:align-middle"
          aria-hidden="true"
        >
          &#8203;
        </span>

        {/* Modal content */}
        <div
          className={`relative inline-block transform overflow-hidden rounded bg-(--color-surface) text-left shadow-xl transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full border border-(--color-border)`}
        >
          {/* Header */}
          <div className="bg-(--color-surface) px-6 py-4 border-b border-(--color-border) flex items-center justify-between">
            <h3 className="text-sm font-medium text-(--color-text)">{title}</h3>
            <button
              onClick={onClose}
              className="text-(--color-text-muted) hover:text-(--color-text) transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[calc(100vh-160px)] overflow-y-auto flex-1 text-(--color-text)">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  // Use createPortal to render modal at document body level
  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
