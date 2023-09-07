module.exports = {
  root: false,
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "../../.eslintrc.js",
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        ".eslintrc.{js,cjs}",
      ],
      parserOptions: {
        sourceType: "script",
      },
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint/eslint-plugin",
  ],
};
