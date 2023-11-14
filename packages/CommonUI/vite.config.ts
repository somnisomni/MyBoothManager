import { fileURLToPath, URL } from "node:url";
import { resolve } from "node:path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ insertTypesEntry: true, rollupTypes: true }),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
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
          vue: "Vue",
          vuetify: "Vuetify",
        },
      },
    },
  },
});
