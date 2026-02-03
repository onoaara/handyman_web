"use client";

import React from "react";
import { Toaster } from "sonner";
import { ReduxProvider } from "@/app/components/providers/ReduxProvider";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { UserInfoProvider } from "@/app/contexts/UserInfoContext";

interface NewProviderProps {
  children: React.ReactNode;
}

const NewProvider: React.FC<NewProviderProps> = ({ children }) => {
  return (
    <ReduxProvider>
      <AuthProvider>
        <UserInfoProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              style: {
                borderRadius: 4,
                fontSize: "10px",
              },
            }}
          />
        </UserInfoProvider>
      </AuthProvider>
    </ReduxProvider>
  );
};

export default NewProvider;
