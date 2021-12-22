module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb/hooks',
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
    // Workaround for a know airbnb style guide issue
    // https://github.com/airbnb/javascript/issues/2505
    'react/function-component-definition': [2, {
      namedComponents: 'function-declaration',
    }],
    'max-len': ['error', { code: 80 }],
  },
};
