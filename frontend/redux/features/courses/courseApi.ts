import { apiSlice } from "../api/apiSlice";

export const courseApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // EndPoints
    getCourse: builder.query({
      query: () => ({
        url: "all-course",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getCoursebyID: builder.query({
      query: (id) => ({
        url: `/get-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getfreeCourse: builder.query({
      query: () => ({
        url: "free-courses",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getfreeCoursebyId: builder.query({
      query: (id) => ({
        url: `/free-course/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetCourseQuery,
  useGetCoursebyIDQuery,
  useGetfreeCourseQuery,
  useGetfreeCoursebyIdQuery,
} = courseApi;
