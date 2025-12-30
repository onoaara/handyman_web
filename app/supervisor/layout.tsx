"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../hooks";
import {
  selectAuthInitialized,
  selectAuthRole,
  selectIsAllowedAuthenticated,
} from "../features/auth/authSlice";
import SupervisorSidebar from "../components/SupervisorSidebar";
import AppHeader from "../components/AppHeader";

export default function SupervisorLayout({
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
    if (authRole !== "supervisor") {
      router.replace("/admin/dashboard");
      return;
    }
  }, [initialized, isAllowed, authRole, router]);

  if (!initialized) return null;
  if (!isAllowed || authRole !== "supervisor") return null;

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      <SupervisorSidebar />
      <main className="flex-1 bg-[var(--color-bg)] p-6">
        <AppHeader title="Supervisor" />
        {children}
      </main>
    </div>
  );
}
