import { defineConfig } from 'vite'

export default defineConfig({
  root: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: false, // This will open the browser automatically
  },
    plugins: [
      {
        name: 'wgsl-watch',
        handleHotUpdate({ file, server }) {
          if (file.endsWith('.wgsl')) {
            server.ws.send({
              type: 'full-reload',
              path: '*'
            });
          }
        }
      }
    ]
})