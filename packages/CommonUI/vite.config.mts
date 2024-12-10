import { resolve } from "node:path";
import { fileURLToPath, URL } from "node:url";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls } }),
    vuetify({ autoImport: true }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        // eslint-disable-next-line camelcase
        keep_classnames: true,
      },
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CommonUI",
      fileName: "common-ui",
      formats: [ "es" ],
    },
    rollupOptions: {
      treeshake: "recommended",
      external: [ "vue", /^vuetify(\/.*)?$/, "vue-facing-decorator", /^@?myboothmanager(\/.*)?$/, "dompurify", "isomorphic-dompurify" ],
      output: {
        globals: {
          "vue": "Vue",
          "vuetify": "Vuetify",
          "vue-facing-decorator": "VueFacingDecorator",
        },
        esModule: true,
        exports: "named",
        strict: true,
      },
    },
  },
});
