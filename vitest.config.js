import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./vitest.setup.js"],
    globals: true,
    globalSetup: "./vitest.setup.js",
    testTimeout: 10000, // Aumentar timeout si la creación de BD tarda
  },
});
