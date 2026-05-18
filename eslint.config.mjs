import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    files: ['src/generated/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    ignores: ['node_modules/', 'dist/', 'src/generated/']
  }
);
