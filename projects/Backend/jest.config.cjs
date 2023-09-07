/* eslint-disable @typescript-eslint/no-var-requires */
const { JestConfigWithTsJest, pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");

/** @type {JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/default-esm",
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: ".",
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
  testRegex: ".*\\.spec\\.ts$",
  coverageDirectory: "./coverage",
  testEnvironment: "node",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
};
