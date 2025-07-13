import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  root: process.cwd(),
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        app: resolve(process.cwd(), 'index.html')
      }
    }
  },
  // Add this to clear cache issues
  clearScreen: false,
  server: {
    fs: {
      strict: false
    }
  }
});