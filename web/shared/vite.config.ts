import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'shared',
      fileName: 'index',
    },
  },
})
