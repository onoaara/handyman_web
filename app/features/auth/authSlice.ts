import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { supabase } from "@/app/lib/supabaseClient";
import type { Session, User } from "@supabase/supabase-js";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export type AuthState = {
  initialized: boolean;
  status: AuthStatus;
  session: Session | null;
  user: User | null;
  role: string | null;
  error: string | null;
};

const initialState: AuthState = {
  initialized: false,
  status: "idle",
  session: null,
  user: null,
  role: null,
  error: null,
};

const allowedRoles = new Set(["admin", "supervisor"]);

const normalizeRole = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : null;

const extractRolesFromUser = (user: User | null) => {
  if (!user) return null;

  const singleRole =
    normalizeRole(
      (user.app_metadata as Record<string, unknown> | null)?.role
    ) ??
    normalizeRole((user.user_metadata as Record<string, unknown> | null)?.role);

  if (singleRole) return [singleRole];

  const rolesValue =
    (user.app_metadata as Record<string, unknown> | null)?.roles ??
    (user.user_metadata as Record<string, unknown> | null)?.roles;

  if (Array.isArray(rolesValue)) {
    const normalized = rolesValue
      .map(normalizeRole)
      .filter((r): r is string => !!r);
    return normalized.length ? normalized : null;
  }

  const maybeRole = normalizeRole(rolesValue);
  return maybeRole ? [maybeRole] : null;
};

const ensureAllowedRole = async (user: User | null) => {
  const roles = extractRolesFromUser(user);
  const allowed = roles?.find((r) => allowedRoles.has(r)) ?? null;

  if (!allowed) {
    await supabase.auth.signOut();
    throw new Error("Only admin and supervisor accounts can sign in.");
  }

  return allowed;
};

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.getSession();
    if (error) return rejectWithValue(error.message);

    const session = data.session ?? null;
    if (!session) {
      return {
        session: null as Session | null,
        user: null as User | null,
        role: null as string | null,
      };
    }

    try {
      const role = await ensureAllowedRole(session.user);
      return { session, user: session.user, role };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unauthorized";
      return rejectWithValue(message);
    }
  }
);

export const loginWithPassword = createAsyncThunk(
  "auth/loginWithPassword",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    const { data, error } = await supabase.auth.signInWithPassword(payload);
    if (error) return rejectWithValue(error.message);

    const session = data.session ?? null;
    const user = data.user ?? null;

    try {
      const role = await ensureAllowedRole(user);
      return { session, user, role };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unauthorized";
      return rejectWithValue(message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const { error } = await supabase.auth.signOut();
    if (error) return rejectWithValue(error.message);
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeAuth.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.initialized = true;
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.status = action.payload.session
          ? "authenticated"
          : "unauthenticated";
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.initialized = true;
        state.session = null;
        state.user = null;
        state.role = null;
        state.status = "unauthenticated";
        state.error =
          (typeof action.payload === "string" && action.payload) ||
          action.error.message ||
          "Failed to initialize auth";
      })
      .addCase(loginWithPassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.user = action.payload.user;
        state.role = action.payload.role;
        state.status = action.payload.session
          ? "authenticated"
          : "unauthenticated";
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.session = null;
        state.user = null;
        state.role = null;
        state.status = "unauthenticated";
        state.error =
          (typeof action.payload === "string" && action.payload) ||
          action.error.message ||
          "Login failed";
      })
      .addCase(logout.fulfilled, (state) => {
        state.session = null;
        state.user = null;
        state.role = null;
        state.status = "unauthenticated";
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.error =
          (typeof action.payload === "string" && action.payload) ||
          action.error.message ||
          "Logout failed";
      });
  },
});

export const { clearAuthError } = authSlice.actions;

export const selectAuthInitialized = (state: RootState) =>
  state.auth.initialized;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthRole = (state: RootState) => state.auth.role;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.status === "authenticated";
export const selectIsAllowedAuthenticated = (state: RootState) =>
  state.auth.status === "authenticated" &&
  !!state.auth.role &&
  allowedRoles.has(state.auth.role);

export const selectIsAdmin = (state: RootState) =>
  state.auth.status === "authenticated" && state.auth.role === "admin";

export const selectIsSupervisor = (state: RootState) =>
  state.auth.status === "authenticated" && state.auth.role === "supervisor";

export const selectHomePath = (state: RootState) => {
  if (state.auth.status !== "authenticated") return "/login";
  if (state.auth.role === "admin") return "/admin/dashboard";
  if (state.auth.role === "supervisor") return "/supervisor/dashboard";
  return "/login";
};

export default authSlice.reducer;
