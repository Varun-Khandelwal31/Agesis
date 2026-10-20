/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@eldersteady/shared-types', 'three', '@react-three/fiber', '@react-three/drei'],
  reactStrictMode: false, // Prevents double WebSocket connections in dev mode
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
