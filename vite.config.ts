import { defineConfig, type Plugin } from "vite";
import { configDefaults } from "vitest/config";
import zip from "vite-plugin-zip-pack";

export default defineConfig({
    base: "./",
    plugins: [
        zip({
            inDir: "dist",
            outDir: "dist",
            outFileName: "solitaire.zip",
        }),
    ],
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
