import globals from 'globals'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import pluginPrettier from 'eslint-plugin-prettier'
import preferArrowFunctions from 'eslint-plugin-prefer-arrow-functions'

export default [
  // replaces .eslintignore
  { ignores: ['eslint.config.mjs', 'node_modules/', 'dist/', 'build/', 'coverage/'] },

  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: process.cwd(),
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'prefer-arrow-functions': preferArrowFunctions,
      prettier: pluginPrettier,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      '@typescript-eslint/consistent-type-imports': 'warn',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/space-before-function-paren': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      'prefer-const': 'warn',

      // keep your Prettier rule customization
      'prettier/prettier': ['warn', { endOfLine: 'auto' }],

      'prefer-arrow-functions/prefer-arrow-functions': [
        'warn',
        {
          allowNamedFunctions: false,
          classPropertiesAllowed: false,
          disallowPrototype: false,
          returnStyle: 'unchanged',
          singleReturnOnly: false,
        },
      ],
    },
  },
]
