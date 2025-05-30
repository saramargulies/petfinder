import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dbw3zep4prcju.cloudfront.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dl5zpyw5k3jeb.cloudfront.net',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
