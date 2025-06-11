export default {
  transform: {},
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/index.js'
  ],
  coverageThreshold: {
    global: {
      statements: 60,
      branches: 60,
      functions: 60,
      lines: 60
    }
  }
}; 