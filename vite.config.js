import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import istanbul from 'vite-plugin-istanbul';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    istanbul({
    include:'src/*',
    exclude: ['node_modules', 'selenium-tests'],
    requireEnv: true,
  })],
  server: {
    port: 5173,
    open: true, // automatically open browser
  },
  build: {
    outDir: 'dist',
    sourcemap: true, // helpful for debugging
  },
  
})

