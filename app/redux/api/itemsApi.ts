import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Item = {
  id: string;
  shop_id: string;
  name: string;
  price: number;
  description: string;
  created_at: string;
  image_url?: string;
  display_picture?: string;
};

export const itemsApi = createApi({
  reducerPath: "itemsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Items"],
  endpoints: (builder) => ({
    getItems: builder.query<Item[], { shop_id?: string } | void>({
      query: (params) => {
        if (params && params.shop_id) {
          return `/items?shop_id=${params.shop_id}`;
        }
        return "/items";
      },
      providesTags: ["Items"],
    }),
  }),
});

export const { useGetItemsQuery } = itemsApi;
