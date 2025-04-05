import js from '@eslint/js';
import babelParser from '@babel/eslint-parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import testingLibrary from 'eslint-plugin-testing-library';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: ['frontend/dist/**/*', 'node_modules/**/*'],
  },
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
    },
  },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        window: true,
        document: true,
        localStorage: true,
        console: true,
        fetch: true,
        test: true,
        expect: true,
      },
    },
    plugins: {
      import: importPlugin,
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'testing-library': testingLibrary,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'import/extensions': 0,
      'no-unused-vars': 'warn',
      'import/no-unresolved': 0,
      'react/prop-types': 0,
      'no-console': 0,
      'react/react-in-jsx-scope': 0,
      'no-underscore-dangle': [
        2,
        {
          allow: ['__filename', '__dirname'],
        },
      ],
      'react/function-component-definition': [
        2,
        {
          namedComponents: 'arrow-function',
        },
      ],
      'testing-library/no-debug': 0,
      'react/jsx-filename-extension': [
        1,
        {
          extensions: ['.js', '.jsx'],
        },
      ],
    },
  },
];
