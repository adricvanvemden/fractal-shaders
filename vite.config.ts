import { defineConfig } from 'vite'

export default defineConfig({
  base: "/fractal-shaders/",
  build: {
    outDir: 'dist',
    emptyOutDir: true,
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
    ],
     publicDir: 'shaders',
})