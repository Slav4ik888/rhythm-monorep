// packages/frontend/vite.config.ts

import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';
  const apiUrl = process.env.VITE_API_URL || 'http://localhost:7575';

  return {
    plugins: [react()],

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
      open: true,
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
