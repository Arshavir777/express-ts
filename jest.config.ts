import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    preset: 'ts-jest',
    roots: ['<rootDir>/src'],
    verbose: true,
    globalSetup: './src/__tests__/setup.ts',
    testMatch: ['<rootDir>/src/__tests__/**/*.test.ts']
  };
};
