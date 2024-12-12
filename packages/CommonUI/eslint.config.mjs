import { generateVueTsLintConfig } from "@somni/eslint-config";

export default [
  ...generateVueTsLintConfig(import.meta.dirname),
];
