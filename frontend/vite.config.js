import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.netlify/functions/api': {
        target: 'https://freewriter-develop-branch.netlify.app',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})

