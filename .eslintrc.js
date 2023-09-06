/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    indent: [ "error", 2 ],
    quotes: [ "error", "double" ],
    semi: [ "error", "always" ],
    "arrow-body-style": [ "error", "as-needed" ],
    "brace-style": [ "error", "1tbs", { "allowSingleLine": true } ],
    "block-spacing": [ "error", "always" ],
    "keyword-spacing": [ "error", {
      "before": true,
      "after": true,
      "overrides": {
        "if": { "after": false },
        "for": { "after": false },
        "while": { "after": false },
        "switch": { "after": false },
        "with": { "after": false },
        "catch": { "after": false },
      },
    }],
    "quote-props": [ "error", "consistent-as-needed" ],
    "comma-dangle": [ "error", "always-multiline" ],
    "linebreak-style": [ "error", "unix" ],
  },
};
