import type { Config } from '@jest/types';

export default {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  moduleNameMapper: {
    '@/(.+)': '<rootDir>/src/$1',
    '@test/(.+)': '<rootDir>/test/$1',
  },
  roots: ['<rootDir>/src', '<rootDir>/test'],
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
} as Config.InitialOptions;
