import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://5538-218-238-15-101.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})


