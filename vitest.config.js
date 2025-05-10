import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    globalSetup: "./vitest.setup.js", // Use this for one-time setup
    sequence: {
      concurrent: false,
    },
    testTimeout: 1000, // Aumentar timeout si la creación de BD tarda
  },
});
