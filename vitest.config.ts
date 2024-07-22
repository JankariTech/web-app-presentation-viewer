import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    clearMocks: true,
    include: ['tests/unit/**/*.spec.ts'],
    exclude: ['**/node_modules/**', '**/dist/*', '**/.{idea,git,vscode}'],
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      reporter: ['lcov', 'text']
    }
  }
})
