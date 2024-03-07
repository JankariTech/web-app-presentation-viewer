import { defineConfig } from '@ownclouders/extension-sdk'

export default defineConfig({
  name: 'web-app-presentation-viewer',
  server: {
    port: 8082
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`
      }
    }
  }
})
