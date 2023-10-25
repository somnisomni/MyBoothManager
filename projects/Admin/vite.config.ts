import { fileURLToPath, URL } from "node:url";
import { execSync } from "node:child_process";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

const commitHash = execSync("git rev-parse --short HEAD").toString().trim();
const packageJson = require("./package.json");

const defines: Record<string, string> = Object.fromEntries(Object.entries({
  VITE__APP_VERSION: `"${packageJson.version}"`,
  VITE__GIT_HASH: `"${commitHash}"` ?? "unknown",
}).map(([key, value]) => [`import.meta.env.${key}`, value]));

// Debug logging
console.debug();
console.debug("Starting Vite for " + process.env.NODE_ENV + " environment");
Object.entries(defines).forEach(([key, value]) => console.debug(key + ": " + value));
console.debug();

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  base: process.env.VITE_BASE_PATH ?? "./",
  define: defines,
});
