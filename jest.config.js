module.exports = {
  setupFilesAfterEnv: ['<rootDir>/setupTests.js', '<rootDir>/node_modules/jest-enzyme/lib/index.js'],
  preset: '@shelf/jest-mongodb',
  testPathIgnorePatterns: ['/node_modules/', '/cypress/'],
}
