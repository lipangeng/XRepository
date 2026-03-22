import { defineConfig } from 'vitest/config'
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
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'axios', 'zustand'],
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['**/*.test.ts', '**/*.test.tsx'],
  },
  resolve: {
    alias: {
      '@': '/src',
      'host': '/src',
    },
  },
})
