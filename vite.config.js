import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss()
  ],

  build: {
    rollupOptions: {
      input: {
        app1: path.resolve(__dirname, './index.html'),
        app2: path.resolve(__dirname, './results.html'),
      },
    },
  }
})
