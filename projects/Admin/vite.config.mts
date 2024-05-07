import { fileURLToPath, URL } from "node:url";
import { execSync } from "node:child_process";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { manualChunksPlugin } from "vite-plugin-webpackchunkname";

/* === Defines === */
const commitHash = process.env.GIT_HASH ?? (() => { try { return execSync("git rev-parse --short HEAD").toString().trim(); } catch(e) { return null; } })();
const packageJson = require("./package.json");

const defines: Record<string, string> = Object.fromEntries(Object.entries({
  VITE__APP_VERSION: `"${packageJson.version}"`,
  VITE__GIT_HASH: `"${commitHash}"` ?? "unknown",
}).map(([key, value]) => [`import.meta.env.${key}`, value]));
/* === */

/* === Code Splitting Chunk Maps === */
const chunkFileNameIncludeMap = {
  "pages/fundamentals": ["App.vue"],
};

const chunkModuleNameIncludeMap = {
  "ui-lib": ["vuetify", "vue", "@vue", "pinia"],
  "ui-fundamentals": ["@mdi/font", "chart.js", "chartjs"],
  "common": ["@myboothmanager"],
};
/* === */

/* === Startup Debug Logging === */
console.debug();
console.debug(" *** ADMIN *** ");
console.debug("Starting Vite for " + process.env.NODE_ENV + " environment");
Object.entries(defines).forEach(([key, value]) => console.debug(key + ": " + value));
console.debug();
/* === */

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    manualChunksPlugin(),
    vue({ isProduction: process.env.NODE_ENV === "production" }),
    vuetify({ autoImport: true }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5888,
  },
  base: process.env.VITE_BASE_PATH ?? "./",
  define: defines,
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          for(const [chunkName, includes] of Object.entries(chunkFileNameIncludeMap)) {
            if(includes.some((include) => id.includes(include))) return chunkName;
          }

          for(const [chunkName, includes] of Object.entries(chunkModuleNameIncludeMap)) {
            if(includes.some((include) => id.includes("node_modules/" + include))) return chunkName;
          }
        },
      },
    },
  },
});
