import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

const outDir = process.env.VITE_BUILD_PATH || 'dist'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, outDir),
    emptyOutDir: true
  },
  resolve: {
    alias: {
      src: '/src'
    }
  }
})
