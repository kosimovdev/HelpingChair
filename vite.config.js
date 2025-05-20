import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/api": {
        target: "https://3c20-14-42-86-31.ngrok-free.app",
        changeOrigin: true,
        secure: false,
      },
    },
    historyApiFallback: true, // 👈 bu qo‘shildi
  },
});
