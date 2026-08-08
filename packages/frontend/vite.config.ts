// packages/frontend/vite.config.ts

import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:7575';

  return {
    plugins: [
      react(),
      svgr(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png'],
        manifest: {
          name: 'Информационная панель руководителя «Ритм»',
          short_name: 'Ритм',
          description: 'PWA-приложение для визуализации бизнес-данных',
          theme_color: '#1976d2',
          background_color: '#ffffff',
          display: 'standalone',
          orientation: 'any',
          start_url: '/',
          scope: '/',
          lang: 'ru',
          icons: [
            {
              src: '/favicon.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/favicon.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/favicon.png',
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
              urlPattern: /^https:\/\/api\.rhy\.thm\.su\/.*/i,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'api-cache',
                expiration: {
                  maxEntries: 100,
                  maxAgeSeconds: 60 * 60 * 24, // 24 часа
                },
              },
            },
          ],
        },
      }),
    ],

    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@mui/styled-engine': '@mui/styled-engine-sc',
        app: resolve(__dirname, 'src', 'app'),
        entities: resolve(__dirname, 'src', 'entities'),
        features: resolve(__dirname, 'src', 'features'),
        pages: resolve(__dirname, 'src', 'pages'),
        shared: resolve(__dirname, 'src', 'shared'),
        widgets: resolve(__dirname, 'src', 'widgets'),
      },
    },

    define: {
      __IS_DEV__: JSON.stringify(isDev),
      __API_URL__: JSON.stringify(apiUrl),
      __PROJECT__: JSON.stringify('frontend'),
    },

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '',
        },
      },
    },

    server: {
      port: 3000,
      open: false,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
        },
      },
    },

    build: {
      outDir: 'build',
      sourcemap: isDev,
    },

    esbuild: {
      target: 'es2020',
    },
  };
});
