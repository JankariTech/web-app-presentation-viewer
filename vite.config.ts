import { defineConfig } from '@ownclouders/extension-sdk'
import { id } from './src/manifest.json'

export default defineConfig({
  base: `/assets/apps/${id}/`,
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        dir: `dist/${id}`,
        entryFileNames: 'extension.js'
      }
    }
  }
})
