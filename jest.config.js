// jest.config.js (ESM)
export default {
  testMatch: ["<rootDir>/test/**/*.js"],
  collectCoverageFrom: ["dist/**/*.js", "!**/*.test.js", "!**/node_modules/**"],
  coverageDirectory: "coverage",
  testEnvironment: "node",
  verbose: true,
  clearMocks: true,
  moduleFileExtensions: ["js", "json"],
  transform: {},
};
