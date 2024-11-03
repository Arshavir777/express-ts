import type { Config } from 'jest';

export default async (): Promise<Config> => {
  return {
    preset: 'ts-jest',
    verbose: true,
    setupFilesAfterEnv: ['./tests/setup.ts']
  };
};
