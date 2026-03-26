import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // ĐỔI "http://localhost:5000" THÀNH LINK BACKEND BẠN ĐÃ DEPLOY TRÊN RENDER HOẶC KOYEB
        // (Ví dụ: "https://ten-backend.onrender.com" hoặc "https://ten-api.koyeb.app")
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
        bypass: (req) => {
          // KHÔNG proxy các file code nội tại của Frontend (Tránh lỗi ECONNREFUSED báo trên terminal)
          if (req.url && req.url.match(/\.(js|jsx|ts|tsx)$/)) {
            return req.url;
          }
        }
      },
    },
  },
});
