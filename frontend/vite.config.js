import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/.netlify/functions/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    middleware: (app) => {
      app.use((req, res, next) => {
        // Handle client-side routing
        if (!req.url.includes('.')) {
          req.url = '/';
        }
        next();
      });
    },
  },
  
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'firebase-messaging-sw.js') {
            return 'firebase-messaging-sw.js';
          }
          return assetInfo.name;
        },
      },
    },
  },
});