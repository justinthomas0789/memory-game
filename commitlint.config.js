export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [
      2,
      'always',
      ['engine', 'hooks', 'ui', 'a11y', 'sound', 'config', 'deps'],
    ],
  },
};
