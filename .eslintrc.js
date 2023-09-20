/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:import/typescript",
    // "plugin:import/recommended" causes error
  ],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      "typescript": true,
    },
  },
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    indent: [ "error", 2, {
      "SwitchCase": 1,
      "VariableDeclarator": "first",
      "FunctionDeclaration": { "parameters": "first" },
      "FunctionExpression": { "parameters": "first" },
      "CallExpression": { "arguments": "first" },
      "ArrayExpression": 1,
      "ObjectExpression": 1,
    }],
    quotes: [ "error", "double" ],
    semi: [ "error", "always" ],
    "semi-spacing": [ "error", {
      "before": false,
      "after": true,
    }],
    "arrow-body-style": [ "error", "as-needed" ],
    "brace-style": [ "error", "1tbs", { "allowSingleLine": true } ],
    "block-spacing": [ "error", "always" ],
    "space-before-blocks": [ "error", "always" ],
    "space-infix-ops": "error",
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
    "eqeqeq": [ "error", "always", { "null": "ignore" } ],
    "import/order": [ "error", {
      "groups": ["builtin", "external", "internal", "parent", "sibling", "index", "object", "type"],
    }],
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/exports-last": "error",
  },
};
