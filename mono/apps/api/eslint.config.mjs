import baseConfig from '../../eslint.config.mjs';
import { defineFlatConfig } from '@eslint/compat';

export default defineFlatConfig([
  ...baseConfig,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      'no-console': 'error', // Example of a project-specific rule
    },
  },
]);
