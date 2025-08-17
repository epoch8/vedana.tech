import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // For custom domain vedana.tech
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist'
  }
})
