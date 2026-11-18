import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: { mode: 'auto' },
});

/** @type {import('next').NextConfig} */
const config = {
  transpilePackages: ['@aics/design-system'],
  poweredByHeader: false,
};

export default withVanillaExtract(config);
