import additionalConfig from "./additional.mjs";
import importConfig from "./import.mjs";
import stylisticConfig from "./stylistic.mjs";
import typescriptConfigs from "./typescript.mjs";
import typescriptVueConfigs from "./typescript-vue.mjs";

const ignores = Object.freeze({
  ignores: [
    "**/node_modules/**",
    "**/dist/**",
    "**/build/**",
    "**/coverage/**",
    "**/(\.)?output/**",
  ],
});

const individualConfigs = Object.freeze({
  additional: additionalConfig,
  import: importConfig,
  stylistic: stylisticConfig,
  typescript: typescriptConfigs,
  typescriptVue: typescriptVueConfigs,
});

export const eslintConfigs = Object.freeze({
  individual: individualConfigs,

  typescript: Object.freeze([
    ignores,
    individualConfigs.import,
    ...individualConfigs.typescript,
    individualConfigs.additional,
    individualConfigs.stylistic,
  ]),
  vue: Object.freeze([
    ignores,
    individualConfigs.import,
    ...individualConfigs.typescriptVue,
    individualConfigs.additional,
    individualConfigs.stylistic,
  ]),
});
