/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  rootDir: ".",
  projects: [
    "<rootDir>/packages/*",
    "<rootDir>/projects/*",
  ],
  coverageDirectory: "./coverage",
  collectCoverageFrom: ["**/*.(t|j)s"],
  extensionsToTreatAsEsm: [".ts"],
};
