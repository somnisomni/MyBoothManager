import { generateTsLintConfig } from "@somni/eslint-config";

export default [
  ...generateTsLintConfig(import.meta.dirname),
];
