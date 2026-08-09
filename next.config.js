const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  basePath: '/Systemly',
  assetPrefix: '/Systemly/',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  turbopack: {
    root: '.',
  },
};

module.exports = withNextIntl(nextConfig);
