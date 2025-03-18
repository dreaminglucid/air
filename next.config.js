/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Completely disable ESLint during production build
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable socket polling in development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Disable HMR socket connection attempts
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000, // Check for changes every second instead of using socket
        aggregateTimeout: 300, // Delay rebuild after the first change
      };
    }
    return config;
  },
  // Add appropriate headers
  async headers() {
    return [
      {
        source: '/socket.io/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig; 