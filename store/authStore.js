import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      // ✅ LOGIN
      login: (authResponse) => {
        // hỗ trợ nhiều format API
        const token = authResponse?.token || authResponse?.data?.token;

        const userData = authResponse?.user ||
          authResponse?.data?.user || {
            userId: authResponse.userId,
            fullName: authResponse.fullName,
            email: authResponse.email,
            role: authResponse.role,
          };

        set({
          token,
          user: {
            userId: userData?.id || userData?.userId,
            fullName: userData?.fullName,
            email: userData?.email,
            role: userData?.role,
          },
        });
      },

      // ✅ LOGOUT
      logout: () => {
        set({ token: null, user: null });
      },

      // ✅ GETTER (đúng chuẩn)
      isAdmin: () => {
        return get().user?.role === "Admin";
      },
    }),
    {
      name: "auth-storage", // đổi tên cho sạch
    },
  ),
);
