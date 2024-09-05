module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    browser: true,
    es2021: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'prefer-arrow-functions', 'prettier'],
  rules: {
    '@typescript-eslint/consistent-type-imports': 'warn',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-redeclare': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prefer-const': 'warn',
    'prettier/prettier': 'warn',
    'prefer-arrow-functions/prefer-arrow-functions': [
      'warn',
      {
        allowNamedFunctions: false,
        classPropertiesAllowed: false,
        disallowPrototype: false,
        returnStyle: 'unchanged',
        singleReturnOnly: false
      }
    ]
  }
}
