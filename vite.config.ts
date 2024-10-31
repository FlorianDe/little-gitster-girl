import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/little-gitster-girl',
  plugins: [react()],
  preview: {
    port: 3000,
  },
  server: {
    port: 3000,
  },
})
