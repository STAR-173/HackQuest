import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/devfolio': {
        target: 'https://api.devfolio.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/devfolio/, ''),
        headers: {
          'Origin': 'https://devfolio.co',
          'Referer': 'https://devfolio.co'
        }
      }
    }
  }
})
