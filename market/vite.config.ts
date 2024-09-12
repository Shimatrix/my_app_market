import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000/", // URL вашего json-server
        changeOrigin: true, // Изменяет origin хоста на целевой URL
        rewrite: (path) => path.replace(/^\/api/, ""), // Убирает /api из пути
      },
    },
  },
})
