module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@tanstack/eslint-plugin-query/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react','react-refresh', '@tanstack/eslint-plugin-query'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ],
    'indent': ['error', 2, {"ignoredNodes": ["JSXAttribute, JSXSpreadAttribute"]}],
    'react/jsx-first-prop-new-line': ['error', 'never'],
    'react/jsx-max-props-per-line': ['error', { maximum: 1, "when": "always" }],
    'react/jsx-indent-props': [2, 'first'],
    'react/jsx-closing-bracket-location': ['error', { nonEmpty: 'tag-aligned', selfClosing: 'tag-aligned' }],
    'react/jsx-closing-tag-location': ['error', { nonEmpty: 'after-props', selfClosing: 'after-props' }],
    'react/jsx-wrap-multilines': ['error', { declaration: 'parens-new-line', assignment: 'parens-new-line', return: 'parens-new-line', arrow: 'parens-new-line', condition: 'parens', logical: 'parens', prop: 'parens-new-line' }],
    'react/jsx-one-expression-per-line': ['error', { allow: 'single-child' }],
    'react/jsx-indent': ['error', 2, { checkAttributes: true, indentLogicalExpressions: false }],
    'react/jsx-equals-spacing': ['error', 'never'],
  },



}
