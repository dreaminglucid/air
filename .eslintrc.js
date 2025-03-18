module.exports = {
  extends: ['next/core-web-api'],
  // Very important: specify the root property to true
  root: true,
  rules: {
    'react/jsx-no-comment-textnodes': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    '@typescript-eslint/no-wrapper-object-types': 'off',
    '@typescript-eslint/no-unsafe-function-type': 'off',
  },
  ignorePatterns: [
    '.next/**/*',
    'node_modules/**/*',
    'public/**/*',
    '*.config.js',
  ],
}; 