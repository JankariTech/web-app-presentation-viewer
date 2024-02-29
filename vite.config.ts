import { defineConfig } from '@ownclouders/extension-sdk'
import { id } from './public/manifest.json'

export default defineConfig({
  base: '/vendor/apps/com.github.jankaritech.web.mdpresentation/',
  build: {
    rollupOptions: {
      output: {
        dir: `dist/${id}`,
        entryFileNames: `extension.js`
      }
    }
  }
})
