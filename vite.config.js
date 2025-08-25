//frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    proxy: {
      // Si une requête commence par '/api'
      '/api': {
        // Redirige-la vers notre serveur backend
        target: 'http://127.0.0.1:3001',
        // C'est nécessaire pour que le backend accepte la requête
        changeOrigin: true,
        //Spy
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // console.log(`[Vite Proxy] Requête transmise à la cible: ${req.method} ${req.url}`);
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // console.log(`[Vite Proxy] Réponse reçue de la cible: ${proxyRes.statusCode} ${req.url}`);
          });
          proxy.on('error', (err, req, res) => {
            // console.error('[Vite Proxy] Erreur:', err);
          });
        }
      }
    }
  }
})
