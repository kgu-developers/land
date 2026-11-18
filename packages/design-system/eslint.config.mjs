import typescript from 'eslint-config-next/typescript';

const config = [...typescript, { ignores: ['dist/**'] }];

export default config;
