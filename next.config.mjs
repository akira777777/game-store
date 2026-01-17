/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Optimize production builds
  swcMinify: true,
  // Compress responses
  compress: true,
  // Enable React strict mode for better error detection
  reactStrictMode: true,
};

export default nextConfig;
