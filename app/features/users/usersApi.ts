import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type ApiUser = {
  id: string;
  name: string | null;
  email: string;
  location: string | null;
  email_verified: boolean | null;
  phone_verified: boolean | null;
  created_at: string;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
};

type UsersApiError = {
  error: string;
  hint?: string;
};

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<ApiUser[], void>({
      query: () => "/users",
      transformErrorResponse: (response: unknown): UsersApiError => {
        if (
          response &&
          typeof response === "object" &&
          "error" in response &&
          typeof response.error === "string"
        ) {
          const errorResponse = response as { error: string; hint?: string };
          return {
            error: errorResponse.error,
            hint: errorResponse.hint,
          };
        }
        return { error: "Failed to fetch users" };
      },
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
