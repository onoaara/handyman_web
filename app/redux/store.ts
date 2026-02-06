import { configureStore } from "@reduxjs/toolkit";
import authReducer, { type AuthState } from "./slices/authSlice";
import themeReducer, { type ThemeState } from "./slices/themeSlice";
import { usersApi } from "./api/usersApi";
import { shopsApi } from "./api/shopsApi";
import { servicesApi } from "./api/servicesApi";
import { bookingsApi } from "./api/bookingsApi";
import { itemsApi } from "./api/itemsApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [shopsApi.reducerPath]: shopsApi.reducer,
    [servicesApi.reducerPath]: servicesApi.reducer,
    [bookingsApi.reducerPath]: bookingsApi.reducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(usersApi.middleware)
      .concat(shopsApi.middleware)
      .concat(servicesApi.middleware)
      .concat(bookingsApi.middleware)
      .concat(itemsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// For use in selectors
export type { AuthState, ThemeState };
