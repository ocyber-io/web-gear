import type { Config } from 'jest';

// Sync object
const config: Config = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverage: true,
  testMatch: ['**/__tests__/**/*.test.ts'],
  coverageReporters: [
    ['html', { subdir: './html' }],
    ['html-spa', { subdir: './html-spa' }],
    ['json', { file: './coverage.json' }],
    ['text', { file: './coverage.txt' }],
    ['teamcity', { file: './coverage.team.txt' }],
  ],
  coverageDirectory: './.coverage',
  watchman: true,
};
export default config;
