import { execSync } from "node:child_process";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import packageJson from "./package.json";

/* === Defines === */
let commitHash = process.env.GIT_HASH;
if(!commitHash) {
  try {
    commitHash = execSync("git rev-parse --short HEAD").toString().trim();
  } catch(e) {
    console.error(`Failed to get commit hash from git: ${e}`);
    commitHash = "unknown";
  }
}
/* === */

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: "2024-12-16",
  nitro: {
    preset: "node-cluster",
  },
  modules: [
    // ESLint
    "@nuxt/eslint",
    // Pinia
    "@pinia/nuxt",
    "pinia-plugin-persistedstate/nuxt",
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
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
        },
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
    pageTransition: {
      name: "page",
      mode: "out-in",
    },
  },
  components: [
    {
      path: "~/components",
      pathPrefix: false,
    },
  ],
  runtimeConfig: {
    public: {
      appVersion: packageJson.version,
      versionGitHash: commitHash,
      apiServerUrl: process.env.NUXT_PUBLIC_API_SERVER_URL ?? "http://api.sora.localhost:20000",
      apiServerUploadsPath: process.env.NUXT_PUBLIC_API_SERVER_UPLOADS_PATH ?? "uploads",
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
  telemetry: false,
});
