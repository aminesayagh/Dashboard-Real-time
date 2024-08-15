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
      'react/react-in-jsx-scope': 'off', // React is always in scope with Next.js
      'react/prop-types': 'off', // TypeScript types are sufficient for prop types
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]);
