import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'robots.txt',
        'og-image.png',
        'sitemap.xml',
      ],
      manifest: {
        name: 'Memory Game',
        short_name: 'Memory',
        description:
          'A browser-based memory card matching game. Find all matching pairs!',
        theme_color: '#4a3728',
        background_color: '#f5ede0',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/www\.googletagmanager\.com\/.*/i,
            handler: 'NetworkOnly',
          },
        ],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'vendor-motion';
          if (
            id.includes('node_modules/react-dom') ||
            id.includes('/node_modules/react/') ||
            id.includes('/node_modules/react-dom/')
          )
            return 'vendor-react';
          if (id.includes('node_modules/react-router')) return 'vendor-router';
          if (
            id.includes('node_modules/i18next') ||
            id.includes('node_modules/react-i18next')
          )
            return 'vendor-i18n';
        },
      },
    },
  },
});
