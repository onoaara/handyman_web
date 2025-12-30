import { configureStore } from "@reduxjs/toolkit";
import authReducer, { type AuthState } from "./features/auth/authSlice";
import themeReducer, { type ThemeState } from "./features/theme/themeSlice";
import { usersApi } from "./features/users/usersApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [usersApi.reducerPath]: usersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// For use in selectors
export type { AuthState, ThemeState };
