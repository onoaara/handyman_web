import { configureStore } from "@reduxjs/toolkit";
import authReducer, { type AuthState } from "./slices/authSlice";
import themeReducer, { type ThemeState } from "./slices/themeSlice";
import { usersApi } from "./api/usersApi";
import { shopsApi } from "./api/shopsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [shopsApi.reducerPath]: shopsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware).concat(shopsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// For use in selectors
export type { AuthState, ThemeState };
