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
        devOptions: {
          enabled: true,
        },
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
          // index.html НЕ прекэшируем: он раздаётся nginx с `Cache-Control: no-cache, no-store`,
          // а навигацию обслуживаем через NetworkFirst (см. runtimeCaching ниже). Иначе после
          // деплоя у пользователей остаётся старая index.html со ссылками на уже удалённые чанки
          // → «Expected a JavaScript module but got MIME text/html» (nginx fallback на index.html).
          globPatterns: ['**/*.{js,css,ico,png,svg,woff2}'],
          globIgnores: ['**/index.html'],
          // Отключаем дефолтный fallback vite-plugin-pwa на прекэшированный index.html —
          // навигацию обслуживает NetworkFirst-роут ниже (свежая версия из сети).
          navigateFallback: null,
          runtimeCaching: [
            {
              // Навигация (полная загрузка страницы): сначала сеть (свежая версия), кэш — только офлайн.
              urlPattern: ({ request }) => request.mode === 'navigate',
              handler: 'NetworkFirst',
              options: {
                cacheName: 'navigations',
                networkTimeoutSeconds: 5,
              },
            },
            {
              // Кэш API-ответов (данные гугл-таблиц и т.п.)
              urlPattern: /\/api\/.*/i,
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
