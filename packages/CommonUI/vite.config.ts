import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({ template: { transformAssetUrls }}),
    vuetify({ autoImport: true }),
    dts({ insertTypesEntry: true, pathsToAliases: true /*, rollupTypes: true */ }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  optimizeDeps: {
    include: ["vue"],
  },
  build: {
    target: "esnext",
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CommonUI",
      fileName: "common-ui",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["vue", "vuetify", "vue-facing-decorator"],
      output: {
        globals: {
          "vue": "Vue",
          "vuetify": "Vuetify",
          "vue-facing-decorator": "VueFacingDecorator",
        },
      },
    },
  },
});
