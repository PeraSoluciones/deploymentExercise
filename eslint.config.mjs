import globals from 'globals';
import stylisticJs from '@stylistic/eslint-plugin-js';
import js from '@eslint/js';

export default [
  {
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: '2021',
      globals: globals.node,
    },
  },
  {
    files: ['**/*.js'],
    languageOptions: { sourceType: 'script', globals: globals.node },
  },
  { languageOptions: { ecmaVersion: 'latest' } },
  js.configs.recommended,
  {
    plugins: { '@stylistic/js': stylisticJs },
    rules: {
      '@stylistic/js/indent': ['error', 2],
      '@stylistic/js/linebreak-style': ['error', 'windows'],
      '@stylistic/js/quotes': ['error', 'single'],
      '@stylistic/js/semi': ['error', 'always'],
      eqeqeq: 'error',
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'always'],
      'arrow-spacing': ['error', { before: true, after: true }],
      'no-console': 0,
    },
  },
  { ignores: ['dist/*'] },
];
