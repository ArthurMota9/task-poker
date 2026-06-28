const nextJest = require('next/jest');

const createJestConfig = nextJest({ dir: './' });

module.exports = createJestConfig({
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next-intl$': '<rootDir>/src/__mocks__/next-intl.ts',
    '^next-intl/(.*)$': '<rootDir>/src/__mocks__/next-intl.ts',
  },
});
