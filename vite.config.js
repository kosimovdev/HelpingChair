import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "http://192.168.0.93:8000",
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true, // 👈 bu qo‘shildi
  },
});
