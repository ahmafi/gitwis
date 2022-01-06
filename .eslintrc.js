module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'react-app'
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'json-format',
  ],
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'max-len': ['error',
      {
        code: 80,
        tabWidth: 2,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true,
      }],
  },
  },
};
