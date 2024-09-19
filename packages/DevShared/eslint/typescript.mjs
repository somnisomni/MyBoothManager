import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config({
  name: "@myboothmanager/dev-shared eslint - typescript",
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.nodeBuiltin,
      ...globals.builtin,
    },
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-empty-object-type": ["error", {
      allowInterfaces: "with-single-extends",
    }],
  },
});
