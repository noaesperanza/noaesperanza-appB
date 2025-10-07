module.exports = {
  '*.{ts,tsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  '*.{js,jsx}': [
    'eslint --fix',
    'prettier --write',
  ],
  '*.{json,css,md}': [
    'prettier --write',
  ],
};
