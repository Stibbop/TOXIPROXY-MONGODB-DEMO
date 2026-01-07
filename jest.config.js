module.exports = {
  testEnvironment: "node",
  collectCoverageFrom: [
    "Toxiproxy.js",
    "controllers/**/*.js",
    "routes/**/*.js",
    "models/**/*.js",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },   
};
