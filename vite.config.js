import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://d7f6-14-42-86-124.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})


