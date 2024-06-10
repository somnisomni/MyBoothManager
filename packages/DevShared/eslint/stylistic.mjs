import stylisticPlugin from "@stylistic/eslint-plugin";

/** @type {import("eslint").Linter.FlatConfig} */
export default {
  ...stylisticPlugin.configs["recommended-flat"],

  name: "@myboothmanager/dev-shared eslint - stylistic",
  rules: {
    "@stylistic/indent": ["error", 2, {
      SwitchCase: 1,
      VariableDeclarator: "first",
      FunctionDeclaration: { parameters: "first" },
      FunctionExpression: { parameters: "first" },
      CallExpression: { arguments: "first" },
      ArrayExpression: 1,
      ObjectExpression: 1,
      ignoredNodes: [
        "FunctionExpression > .params[decorators.length > 0]",
        "FunctionExpression > .params > :matches(Decorator, :not(:first-child))",
        "ClassBody.body > PropertyDefinition[decorators.length > 0] > .key",
      ],
    }],
    "@stylistic/keyword-spacing": ["error", {
      before: true,
      after: true,
      overrides: {
        if: { after: false },
        for: { after: false },
        while: { after: false },
        switch: { after: false },
        with: { after: false },
        catch: { after: false },
      },
    }],
    "@stylistic/semi": ["error", "always"],
    "@stylistic/quotes": ["error", "double"],
    "@stylistic/block-spacing": ["error", "always"],
    "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
    "@stylistic/space-before-blocks": ["error", "always"],
    "@stylistic/space-infix-ops": "error",
    "@stylistic/comma-dangle": ["error", "always-multiline"],
  },
};
