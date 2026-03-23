import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'mfe_repo',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './RepositoryList': './src/pages/RepositoryList.tsx',
        './CreateRepository': './src/pages/CreateRepository.tsx',
        './RepositoryDetail': './src/pages/RepositoryDetail.tsx',
        './ArtifactBrowser': './src/pages/ArtifactBrowser.tsx',
        './UploadArtifact': './src/pages/UploadArtifact.tsx',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@tanstack/react-query', 'axios'],
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
  },
})
