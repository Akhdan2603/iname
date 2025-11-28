import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      // Setiap request yang diawali '/api' akan diteruskan ke server hosting
      '/api': {
        target: 'http://iname.page.gd', // URL Website/Backend kamu
        changeOrigin: true,
        secure: false, // Set false karena kadang sertifikat SSL hosting gratis bermasalah
        rewrite: (path) => path.replace(/^\/api/, ''), // Hapus tulisan '/api' sebelum dikirim
      },
    },
  },
})