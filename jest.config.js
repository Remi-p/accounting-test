module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['<rootDir>/src/**/*.test.ts'],
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/@types/**/*.ts',
        '!tests/**/*.ts',
    ],
};
