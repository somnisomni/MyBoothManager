module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  overrides: [
    {
      env: {
        "node": true,
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
  rules: {
    indent: [ "error", 2 ],
    quotes: [ "error", "double" ],
    semi: [ "error", "always" ],
    "linebreak-style": [ "error", "unix" ],
    "comma-dangle": ["error", "always-multiline"],
  },
};
