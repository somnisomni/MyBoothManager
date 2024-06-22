import { eslintConfigs } from "@myboothmanager/dev-shared";
import withNuxt from "./.nuxt/eslint.config.mjs";

export default withNuxt(
  ...eslintConfigs.vue,
);
