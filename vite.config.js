import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 8090
  },
  define: {
    'process.env': {
      VITE_API_BASE_URL: JSON.stringify(process.env.VITE_API_BASE_URL || 'http://localhost:8080')
    }
  }
}) 