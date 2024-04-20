module.exports = {
  ignorePatterns: ['.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'justinanastos'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
    'prettier',
  ],
  parserOptions: {
    project: ['./tsconfig.json'],
  },
  env: {
    node: true,
  },
  rules: {
    'no-shadow': 'error',
    'new-cap': 'error',
    'no-console': 'off',
    'object-shorthand': 'error',
    'justinanastos/switch-braces': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    '@typescript-eslint/no-unsafe-argument': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
  },
};
