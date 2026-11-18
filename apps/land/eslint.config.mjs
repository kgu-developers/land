import next from 'eslint-config-next/core-web-vitals';
import typescript from 'eslint-config-next/typescript';

export default [
  { ignores: ['.vercel/**'] },
  ...next,
  ...typescript,
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
          pathGroups: [
            { pattern: 'react', group: 'builtin', position: 'before' },
            { pattern: '@aics/**', group: 'external', position: 'after' },
          ],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'always',
        },
      ],
      'react/no-unescaped-entities': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
