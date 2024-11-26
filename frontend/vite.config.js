import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://freewriter-develop-branch.netlify.app/.netlify/functions/api'
    }
  }
})

