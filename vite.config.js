import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/i2i-academy-3d-cafe-rush/',
  plugins: [react()],
})
