import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0", // 👈 boshqa qurilmalarga ochiq qilish uchun
    port: 5173,
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, "certs/localhost-key.pem")),
    //   cert: fs.readFileSync(path.resolve(__dirname, "certs/localhost.pem")),
    // },
  },
});
