import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.netlify/functions/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})

