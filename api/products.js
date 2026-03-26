import apiClient from "./client";

export const productApi = {
  getProducts: (params = {}) => apiClient.get("/products", { params }).then((r) => r.data),
  getProductBySlug: (slug) => apiClient.get(`/products/slug/${slug}`).then((r) => r.data),
};
