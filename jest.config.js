/** @type {import("ts-jest").JestConfigWithTsJest} */
module.exports = {
  rootDir: ".",
  projects: [
    "<rootDir>/packages/*",
    "<rootDir>/projects/*",
  ],
  collectCoverageFrom: ["**/*.(t|j)s"],
};
