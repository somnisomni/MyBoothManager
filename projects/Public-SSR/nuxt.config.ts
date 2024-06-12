import { execSync } from "node:child_process";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import packageJson from "./package.json";

/* === Defines === */
const commitHash = process.env.GIT_HASH ?? (() => { try { return execSync("git rev-parse --short HEAD").toString().trim(); } catch(e) { return null; } })();

const defines: Record<string, string> = Object.fromEntries(Object.entries({
  VITE__APP_VERSION: `"${packageJson.version}"`,
  VITE__GIT_HASH: `"${commitHash ?? "unknown"}"`,
}).map(([key, value]) => [`import.meta.env.${key}`, value]));
/* === */

/* === Startup Debug Logging === */
console.debug();
console.debug(" *** PUBLIC *** ");
console.debug("Starting Nuxt.js for " + process.env.NODE_ENV + " environment");
Object.entries(defines).forEach(([key, value]) => console.debug(key + ": " + value));
console.debug();
/* === */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  modules: [
    // ESLint
    "@nuxt/eslint",
    // Pinia
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    // Vuetify
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins?.push(vuetify({ autoImport: true }));
      });
    },
  ],
  eslint: {
    config: {
      standalone: false,
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    define: defines,
  },
  build: {
    transpile: ["vuetify"],
  },
  devServer: {
    port: 20002,
  },
  devtools: {
    enabled: true,
  },
});
