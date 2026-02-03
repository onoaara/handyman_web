"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import { store } from "./redux/store";
import { initializeAuth } from "./redux/slices/authSlice";
import { selectThemeMode } from "./redux/slices/themeSlice";

function AuthInitializer() {
  useEffect(() => {
    store.dispatch(initializeAuth());
  }, []);
  return null;
}

function ThemeSetter() {
  const themeMode = selectThemeMode(store.getState());

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const mode = selectThemeMode(store.getState());
      document.documentElement.setAttribute("data-theme", mode);
      localStorage.setItem("theme", mode);
    });

    // Set initial
    document.documentElement.setAttribute("data-theme", themeMode);
    localStorage.setItem("theme", themeMode);

    return unsubscribe;
  }, [themeMode]);

  return null;
}

function ToasterWrapper() {
  const themeMode = selectThemeMode(store.getState());
  const [currentTheme, setCurrentTheme] = useState(themeMode);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const mode = selectThemeMode(store.getState());
      setCurrentTheme(mode);
    });
  }, []);

  return (
    <Toaster
      position="top-right"
      theme={currentTheme === "dark" ? "dark" : "light"}
      richColors
    />
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer />
      <ThemeSetter />
      <ToasterWrapper />
      {children}
    </Provider>
  );
}
