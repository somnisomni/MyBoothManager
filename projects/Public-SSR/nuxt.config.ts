import { execSync } from "node:child_process";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import packageJson from "./package.json";

/* === Defines === */
let commitHash = process.env.GIT_HASH;
if(!commitHash) {
  try {
    commitHash = execSync("git rev-parse --short HEAD").toString().trim();
  } catch(e) {
    commitHash = "unknown";
  }
}
/* === */

/* === Startup Debug Logging === */
console.debug();
console.debug(" *** PUBLIC *** ");
console.debug("Starting Nuxt.js for " + process.env.NODE_ENV + " environment");
console.debug(`  - package.json app version: ${packageJson.version}`);
console.debug(`  - Git hash: ${commitHash}`);
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
    // Nuxt class component
    "nuxt3-class-component",
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
  },
  css: [
    "~/assets/styles/styles.scss",
  ],
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          as: "style",
          crossorigin: "anonymous",
          href: "https://cdn.jsdelivr.net/gh/orioncactus/pretendard@latest/dist/web/variable/pretendardvariable-dynamic-subset.css",
        },
      ],
    },
  },
  components: [
    { path: "~/components", pathPrefix: false },
  ],
  runtimeConfig: {
    public: {
      appVersion: packageJson.version,
      versionGitHash: commitHash,
      apiServerUrl: "http://api.sora.localhost:20000",
      apiServerUploadsPath: "uploads",
    },
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
