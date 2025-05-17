import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";

export default defineConfig({
    plugins: [],
    test: {
        globals: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "html"],
            include: ["src/**/*.ts"],
            exclude: [
                "**/*.spec.ts",
                "**/*.test.ts",
                "**/node_modules/**",
                "src/graphics/texture/**",
                "src/main.ts",
            ],
        },
    },
});
