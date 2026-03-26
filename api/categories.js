import apiClient from "./client";

export const categoryApi = {
  getAll: () => apiClient.get("/categories").then((r) => r.data),
};
