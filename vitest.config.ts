import { defineConfig } from 'vitest/config'

const FOLDERS = {
  unit: ['./utils/**/*.test.ts'],
  node_modules: ['node_modules'],
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: FOLDERS.unit,
    exclude: FOLDERS.node_modules,
  },
  resolve: {
    alias: {
      bot_handlers: './utils/bot/handlers',
    },
  },
})
