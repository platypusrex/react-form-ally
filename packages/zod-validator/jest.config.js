module.exports = {
  transformIgnorePatterns: ['node_modules', 'dist', '.turbo'],
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
};
