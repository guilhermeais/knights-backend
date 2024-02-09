import { defineConfig, mergeConfig } from 'vitest/config';
import defaultConfig from './vitest.config';

export default mergeConfig(
  defaultConfig,
  defineConfig({
    test: {
      include: ['**/*.e2e-spec.ts'],
      setupFiles: ['./test/setup-e2e.ts'],
    },
  }),
);
