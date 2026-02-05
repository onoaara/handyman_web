import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Shop = {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  athour: string;
  supervisor_id: string;
  location: string;
};

export const shopsApi = createApi({
  reducerPath: "shopsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Shops"],
  endpoints: (builder) => ({
    getShops: builder.query<Shop[], void>({
      query: () => "/shops",
      providesTags: ["Shops"],
    }),
    createShop: builder.mutation<Shop, Partial<Shop>>({
      query: (body) => ({
        url: "/shops",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Shops"],
    }),
    updateShop: builder.mutation<Shop, { id: string; data: Partial<Shop> }>({
      query: ({ id, data }) => ({
        url: `/shops/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Shops"],
    }),
    deleteShop: builder.mutation<void, string>({
      query: (id) => ({
        url: `/shops/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Shops"],
    }),
  }),
});

export const {
  useGetShopsQuery,
  useCreateShopMutation,
  useUpdateShopMutation,
  useDeleteShopMutation,
} = shopsApi;
