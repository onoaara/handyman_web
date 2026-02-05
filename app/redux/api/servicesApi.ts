import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  display_picture: string | null;
  created_at: string;
};

export const servicesApi = createApi({
  reducerPath: "servicesApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Services"],
  endpoints: (builder) => ({
    getServices: builder.query<Service[], void>({
      query: () => "/services",
      providesTags: ["Services"],
    }),
  }),
});

export const { useGetServicesQuery } = servicesApi;
