module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/all',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react'],
  overrides: [
    {
      files: ['*.gql'],
      extends: [
        'plugin:@graphql-eslint/schema-recommended',
        'plugin:@graphql-eslint/operations-recommended',
      ],
      rules: {
        '@graphql-eslint/executable-definitions': 'off',
        '@graphql-eslint/strict-id-in-types': [
          'error',
          {
            exceptions: { types: ['File'] },
          },
        ],
      },
    },
  ],
};
