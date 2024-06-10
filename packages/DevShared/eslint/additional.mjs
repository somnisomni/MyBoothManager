/** @type {import("eslint").Linter.FlatConfig} */
export default {
  name: "@myboothmanager/dev-shared eslint - additional rules",
  rules: {
    "eqeqeq": ["error", "always", { null: "ignore" }],
    "quote-props": ["error", "consistent-as-needed"],
    "arrow-body-style": ["error", "as-needed"],
    "semi-spacing": ["error", {
      before: false,
      after: true,
    }],
  },
};
