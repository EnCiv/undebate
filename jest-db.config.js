module.exports = {
    testTimeout: 5000000,
    setupFilesAfterEnv: ['<rootDir>/setupTests.js', '<rootDir>/node_modules/jest-enzyme/lib/index.js'],
    preset: '@shelf/jest-mongodb',
}
