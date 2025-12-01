

/** @type {import('next').NextConfig} */
const nextConfig = {
  // DO NOT set output: 'export' - this breaks client-side navigation
  images: {
    domains: [
      'localhost',
      'aywdqckzqzyleoavalqf.supabase.co'   // ✅ Add your Supabase domain here
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Ensure React strict mode for better hydration error detection
  reactStrictMode: true,
  async rewrites() {
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    return [
      { source: '/user/:path*', destination: `${backendBase}/user/:path*` },
      { source: '/product/:path*', destination: `${backendBase}/product/:path*` },
      { source: '/order/:path*', destination: `${backendBase}/order/:path*` },
    ];
  },
};

module.exports = nextConfig

