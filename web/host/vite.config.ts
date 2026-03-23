import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'xnexus-host',
      remotes: {
        'mfe-repo': 'http://localhost:3001/assets/remoteEntry.js',
        'mfe-task': 'http://localhost:3002/assets/remoteEntry.js',
        'mfe-setting': 'http://localhost:3003/assets/remoteEntry.js',
      },
      shared: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'axios',
        'zustand',
      ],
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': '/src',
      'host': '/src',
    },
  },
  optimizeDeps: {
    exclude: ['mfe-repo', 'mfe-task', 'mfe-setting'],
  },
})
