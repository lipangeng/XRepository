import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'mfe-repo',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './routes': './src/routes.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'axios'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      'host': '/src',
    },
  },
})
