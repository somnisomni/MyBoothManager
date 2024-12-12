import { generateVueTsLintConfig } from "@somni/eslint-config";
import { withNuxt } from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  ...generateVueTsLintConfig(import.meta.dirname),
);
