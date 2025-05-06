import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  root: './',
  base: './',
  build: {
    outDir: 'dist',        // Output hasil build
    emptyOutDir: true      // Kosongkan dulu folder dist sebelum build
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // Untuk import seperti '@/komponen'
    }
  }
})
