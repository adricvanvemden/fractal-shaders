import { defineConfig } from 'vite'

export default defineConfig({
  base: "/fractal-shaders/",
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