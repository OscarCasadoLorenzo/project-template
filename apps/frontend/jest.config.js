/* eslint-disable @typescript-eslint/no-var-requires */
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you soon)
    "^@/(.*)$": "<rootDir>/$1",
    "^@project-template/ui$": "<rootDir>/../../packages/ui/src",
  },
  testEnvironment: "jest-environment-jsdom",
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "html"],
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "components/**/*.{js,jsx,ts,tsx}",
    "contexts/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "utils/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/*.test.{js,jsx,ts,tsx}",
    "!**/*.spec.{js,jsx,ts,tsx}",
    "!**/node_modules/**",
    "!**/.next/**",
    "!**/coverage/**",
    "!**/dist/**",
  ],
  testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
