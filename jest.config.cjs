/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  rootDir: ".",
  projects: [
    "<rootDir>/packages/*",
    "<rootDir>/projects/*",
  ],
  coverageDirectory: "./coverage",
  coverageReporters: ["text", "text-summary", "json"],
  collectCoverageFrom: ["**/*.(t|j)s", "!**/node_modules/**", "!**/dist/**"],
  extensionsToTreatAsEsm: [".ts"],
};
