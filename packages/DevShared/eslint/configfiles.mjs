import globals from "globals";

/** @type {import("eslint").Linter.FlatConfig} */
export default {
  name: "@myboothmanager/dev-shared eslint - project config files",
  files: ["*.config.(m|c)?(t|j)s"],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.nodeBuiltin,
      ...globals.builtin,
    },
  },
};
