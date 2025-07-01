import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // base: "/",
  plugins: [react(), tailwindcss()],
  // server: {
  //   // host: "0.0.0.0", // 👈 boshqa qurilmalarga ochiq qilish uchun
  //   // port: 5175,
  //   // // proxy: {
  //   // //   "/api": {
  //   // //     target: "https://6909-14-42-86-124.ngrok-free.app",
  //   // //     changeOrigin: true,
  //   // //     secure: false, // agar https bo‘lsa, bu parametr kerak bo‘lishi mumkin
  //   // //     // rewrite: (path) => path.replace(/^\/api/, ""),
  //   // //   },
  //   // // },
  // },
});
