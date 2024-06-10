import importPlugin from "eslint-plugin-import";
import { fixupPluginRules } from "@eslint/compat";
import { parser as tsParser } from "typescript-eslint";

/** @type {import("eslint").Linter.FlatConfig} */
export default {
  files: ["**/*.(m|c)?(t|j)s", "**/*.vue"],
  plugins: {
    import: fixupPluginRules(importPlugin),
  },
  settings: {
    ...importPlugin.configs.typescript.settings,
    "import/resolver": {
      typescript: true,
      node: true,
    },
  },
  languageOptions: {
    parserOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  rules: {
    // Import plugin rules
    ...importPlugin.configs.recommended.rules,
    ...importPlugin.configs.typescript.rules,
    "import/namespace": "off",
    "import/order": [ "error", {
      groups: ["type", "builtin", "external", "internal", "parent", "sibling", "index", "object"],
    }],
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/exports-last": "error",
  },
};
