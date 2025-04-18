import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:2000',
        changeOrigin: true,
        secure: false,
        withCredentials: true,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('Origin', 'http://localhost:5173');
          });
        },
        // Handle cookie rewriting for development
        // vite.config.js (excerpt)
        onProxyRes: (proxyRes) => {
          const sc = proxyRes.headers['set-cookie'];
          if (Array.isArray(sc)) {
            proxyRes.headers['set-cookie'] = sc.map(cookie =>
                cookie.replace(/; SameSite=Lax/gi, '; SameSite=None')
            );
          }
        }

      }
    }
  }
});