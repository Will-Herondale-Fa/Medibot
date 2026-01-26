/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  serverRuntimeConfig: {
    // Only available on the server side
    apiSecret: process.env.API_SECRET,
  },
  publicRuntimeConfig: {
    // Exposed to the frontend
    staticFolder: '/public',
  },
};

module.exports = nextConfig;
