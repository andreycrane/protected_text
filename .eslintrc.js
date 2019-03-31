module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    'airbnb',
    'plugin:flowtype/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: [
    'flowtype',
    'react',
    'jest'
  ],
  rules: {
    "react/jsx-filename-extension": [
      "error",
      {
        "extensions": [".js", ".jsx"]
      }
    ],
    'flowtype/require-valid-file-annotation': [
      'error',
      'always',
      {
         'annotationStyle': 'line'
      }
    ],
    'flowtype/no-weak-types': ['error'],
    'flowtype/require-return-type': ['error', 'always'],
  },
  overrides: {
    files: [
      "*.test.js",
    ],
    env: {
      'jest/globals': true,
    },
    settings: {
      flowtype: {
        onlyFilesWithFlowAnnotation: true
      }
    },
  }
};
