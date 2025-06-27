import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/btc/',
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.binance.com/api/v3',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
        secure: false
      }
    }
  }
})
