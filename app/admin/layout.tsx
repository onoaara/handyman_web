"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../hooks";
import {
  selectAuthInitialized,
  selectAuthRole,
  selectIsAllowedAuthenticated,
} from "../features/auth/authSlice";
import AdminSidebar from "../components/AdminSidebar";
import AppHeader from "../components/AppHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const initialized = useAppSelector(selectAuthInitialized);
  const isAllowed = useAppSelector(selectIsAllowedAuthenticated);
  const authRole = useAppSelector(selectAuthRole);

  useEffect(() => {
    if (!initialized) return;
    if (!isAllowed) {
      router.replace("/login");
      return;
    }
    if (authRole !== "admin") {
      router.replace("/supervisor/dashboard");
      return;
    }
  }, [initialized, isAllowed, authRole, router]);

  if (!initialized) return null;
  if (!isAllowed || authRole !== "admin") return null;

  return (
    <div className="flex min-h-screen bg-(--color-bg) text-(--color-text)">
      <AdminSidebar />
      <main className="flex-1 bg-(--color-bg) p-6">
        <AppHeader title="Admin" />
        {children}
      </main>
    </div>
  );
}
