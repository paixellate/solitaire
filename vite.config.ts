import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
  plugins: [],
  test: {
    globals: true,
  },
});
