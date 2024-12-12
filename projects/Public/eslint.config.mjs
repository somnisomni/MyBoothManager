import { vueTs } from "@somni/eslint-config";
import { withNuxt } from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  ...vueTs,
);
