/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withNextra = require('nextra')({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
});

module.exports = withNextra(nextConfig);
