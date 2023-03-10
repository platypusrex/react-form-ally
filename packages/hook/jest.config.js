module.exports = {
  coveragePathIgnorePatterns: [
    '<rootDir>/src/types',
    // TODO: remove this once the utils are actually being used and have test coverage
    '<rootDir>/src/utils/getInputNameAndValue.ts',
    '<rootDir>/src/utils/getNameAndValueFromSyntheticEvent.ts',
  ],
  testEnvironment: 'jsdom',
  transformIgnorePatterns: ['node_modules', 'dist', '.turbo'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
