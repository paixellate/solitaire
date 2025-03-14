import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
  plugins: [],
  build: {
    target: 'esnext'
  },
  test: {
    globals: true,
    environment: 'node'
  }
})