import apiClient from "./client";

export const blogApi = {
  getAll: (params = {}) => apiClient.get("/blog", { params }).then((r) => r.data),
  getBlogs: () => apiClient.get("/blog").then((r) => r.data),
  getBySlug: (slug) => apiClient.get(`/blog/slug/${slug}`).then((r) => r.data),
};
