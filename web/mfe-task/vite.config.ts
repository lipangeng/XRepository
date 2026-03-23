import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'mfe_task',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './TaskList': './src/pages/TaskList.tsx',
        './TaskDetail': './src/pages/TaskDetail.tsx',
        './TriggerTask': './src/pages/TriggerTask.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'axios'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
})
