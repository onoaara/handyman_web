"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "../redux/hooks";
import {
  selectAuthInitialized,
  selectAuthRole,
  selectIsAllowedAuthenticated,
} from "../redux/slices/authSlice";
import NewProvider from "./providers";

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
    <html lang="en">
      <body>
        <NewProvider>
          <div className="bg-(--color-bg)">{children}</div>
        </NewProvider>
      </body>
    </html>
  );
}
