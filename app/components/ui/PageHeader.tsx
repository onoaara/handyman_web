"use client";

import { ReactNode } from "react";

export function PageHeaderTitle({ children }: { children: ReactNode }) {
  return (
    <h1 className="text-xl font-semibold text-(--color-text) flex items-center">
      {children}
    </h1>
  );
}

export function PageHeaderSubtitle({ children }: { children: ReactNode }) {
  return <p className="text-sm text-(--color-text-muted)">{children}</p>;
}
