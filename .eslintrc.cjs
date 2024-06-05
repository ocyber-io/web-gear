module.exports = {
  root: true,
  env: {browser: true, es2020: true},
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', "eslint-config-prettier"],
  ignorePatterns: ['dist', '.eslintrc.cjs', "*.test.ts", "*.mock.ts"],
  parser: '@typescript-eslint/parser',
  plugins: [],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
}
