import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
  name: "@myboothmanager/dev-shared eslint - typescript",
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
  ],
});
