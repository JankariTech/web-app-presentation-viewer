import { defineConfig } from '@ownclouders/extension-sdk'
import { id } from './public/manifest.json'

// TODO: make APPS_LOADING default after oCIS 5.1 is released
const base =
  process.env.APPS_LOADING === 'true' ? '/assets/apps' : 'https://host.docker.internal:3000'

export default defineConfig({
  base: `${base}/${id}/`,
  build: {
    rollupOptions: {
      output: {
        dir: `dist/${id}`,
        entryFileNames: 'extension.js'
      }
    }
  }
})
