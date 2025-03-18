import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginJest from 'eslint-plugin-jest';
import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.{js,ts}'], // ✅ Includes both JavaScript & TypeScript files
    ignores: ['**/testContact.js'], // ✅ Exclude testContact.js
    languageOptions: {
      parser: parserTs, // ✅ Use TypeScript parser
      sourceType: 'module', // ✅ Use ES module instead of CommonJS
      ecmaVersion: 'latest', // ✅ Enable latest ECMAScript features
      globals: {
        ...globals.node, // ✅ Include Node.js globals
        ...globals.jest, // ✅ Ensure Jest globals (describe, test, expect)
      },
    },
    plugins: { 
      js: pluginJs, 
      jest: pluginJest,  // ✅ Corrected Jest plugin format for Flat Config
      ts: pluginTs,
    },
    rules: {
      semi: ['error', 'always'], // ✅ Enforce semicolons
      quotes: ['error', 'single'], // ✅ Enforce single quotes
      'no-unused-vars': 'warn', // ✅ Warn for unused variables
      'no-console': 'off', // ✅ Allow console logs
      eqeqeq: ['error', 'always'], // ✅ Enforce strict equality
    },
  },
  pluginJs.configs.recommended,
  pluginJest.configs.recommended, // ✅ Ensure Jest’s recommended rules are loaded
  pluginTs.configs.recommended, // ✅ Ensure TypeScript ESLint rules are loaded
];
