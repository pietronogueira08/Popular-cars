import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/admin/login',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ]
  },
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'clrzdsyrltqkssenlvsp.supabase.co',
      },
    ],
  },
};

export default nextConfig;
