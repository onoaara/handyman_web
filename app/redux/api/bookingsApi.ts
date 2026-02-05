import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Booking = {
  id: string;
  status: string;
  created_at: string;
};

export const bookingsApi = createApi({
  reducerPath: "bookingsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Bookings"],
  endpoints: (builder) => ({
    getBookings: builder.query<Booking[], void>({
      query: () => "/bookings",
      providesTags: ["Bookings"],
    }),
  }),
});

export const { useGetBookingsQuery } = bookingsApi;
