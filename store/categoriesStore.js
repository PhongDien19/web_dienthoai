// src/store/categoriesStore.js
import { create } from "zustand";
import { categoryApi } from "../api/categories";

export const useCategoriesStore = create((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchIfEmpty: async () => {
    const { categories, loading } = get();
    if (categories.length > 0 || loading) return;

    set({ loading: true, error: null });

    try {
      const res = await categoryApi.getAll();

      // 🔥 FIX QUAN TRỌNG NHẤT
      const data = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.items)
            ? res.items
            : [];

      set({
        categories: data,
        loading: false,
      });
    } catch (err) {
      console.error("Lỗi categories:", err);
      set({
        error: "Không thể tải danh mục.",
        loading: false,
        categories: [], // 🔥 chống crash
      });
    }
  },
}));
