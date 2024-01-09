module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        // arrowParens: 'avoid',
        // singleQuote: true,
        // trailingComma: 'all',
      },
    ],
  },
};
