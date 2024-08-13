import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import node from 'eslint-plugin-node';
import _import from 'eslint-plugin-import';
import promise from 'eslint-plugin-promise';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
        'dist', 'node_modules', 'coverage', 'eslint.config.mjs', 'webpack.config.js', 'tsconfig.json',
    ],
  },
  ...fixupConfigRules(
    compat.extends(
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:prettier/recommended',
    ),
  ),
  {
    plugins: {
      '@typescript-eslint': fixupPluginRules(typescriptEslint),
      prettier: fixupPluginRules(prettier),
      node,
      import: fixupPluginRules(_import),
      promise,
      'jsx-a11y': jsxA11Y,
    },

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname, // This is the root directory of the
        ecmaVersion: "latest", // Use the latest ECMAScript standard
        sourceType: "module", // Use ECMAScript modules
      }
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx', '.js', '.jsx'],
      },

      'import/resolver': {
        typescript: {
            project: path.resolve(__dirname, './tsconfig.json'),
        },
        node: {
            paths: [path.resolve(__dirname, './src')],
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        }
      },
    },

    rules: {
      'prettier/prettier': 'error',

      'import/order': [
        'error',
        {
          groups: [['builtin', 'external', 'internal']],
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
      
    },
  },
];
