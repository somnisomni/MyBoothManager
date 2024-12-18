import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
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
        keep_classnames: true,
      },
    },
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "CommonUI",
      fileName: "common-ui",
      formats: ["es"],
    },
    rollupOptions: {
      treeshake: "recommended",
      external: ["@mdi/font", "vue", /^vuetify(\/.*)?$/, "vue-facing-decorator", /^@?myboothmanager(\/.*)?$/, "dompurify", "marked"],
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
