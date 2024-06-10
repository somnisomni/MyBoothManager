import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";
import vuePlugin from "eslint-plugin-vue";
import globals from "globals";

/** @type {Array<import("eslint").Linter.FlatConfig>} */
export default [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...vuePlugin.configs["flat/essential"],
  {
    name: "@myboothmanager/dev-shared eslint - typescript + vue",
    files: ["*.vue", "**/*.vue"],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: "latest",
        sourceType: "module",
      },
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
  },
];

//  tseslint.config(
//   {
//     name: "@myboothmanager/dev-shared eslint - typescript + vue",
//     files: ["**/*.(m|c)?ts", "**/*.vue"],
//     extends: [
//       eslint.configs.recommended,
//       tseslint.configs.eslintRecommended,
//     ],
//   },
//   ...vuePlugin.configs["flat/recommended"],
//   {
//     plugins: {
//       "typescript-eslint": tseslint.plugin,
//     },
//     languageOptions: {
//       parserOptions: {
//         parser: tseslint.parser,
//         project: "./tsconfig.app.json",
//         extraFileExtensions: [".vue"],
//         sourceType: "module",
//       },
//     },
//   },
// );
