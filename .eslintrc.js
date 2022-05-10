module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'airbnb-base',
    'plugin:vue/recommended',
    'plugin:vue/essential',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: [
          'state',
        ],
      },
    ],
    'vue/no-multiple-template-root': 0,
    'vue/no-mutating-props': 0,
    'vue/multi-word-component-names': 0,
  },
};
