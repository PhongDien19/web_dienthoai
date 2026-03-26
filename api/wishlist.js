import apiClient from "./client";

export const wishlistApi = {
  getWishlist: () => apiClient.get("/wishlist").then((r) => r.data),
  getWishlistIds: () => apiClient.get("/wishlist/ids").then((r) => r.data),
  toggle: (productId) => apiClient.post(`/wishlist/${productId}/toggle`).then((r) => r.data),
  remove: (productId) => apiClient.delete(`/wishlist/${productId}`).then((r) => r.data),
};
