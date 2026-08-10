const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Systemly',
  assetPrefix: '/Systemly/',
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  turbopack: {
    root: '.',
  },
};

module.exports = withNextIntl(nextConfig);
