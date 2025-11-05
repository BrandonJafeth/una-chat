/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTests.ts",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      reporter: ["text", "lcov"],
      reportsDirectory: "./coverage",
      exclude: ["**/*.d.ts", "src/main.tsx", "src/vite-env.d.ts"]
    }
  }
});
