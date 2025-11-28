/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // Use NEXT_PUBLIC_BACKEND_URL in production (e.g., https://api.hotelbazar.org)
    // and fall back to localhost for local development.
    const backendBase = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';
    return [
      {
        source: '/user/:path*',
        destination: `${backendBase}/user/:path*`,
      },
      {
        source: '/product/:path*',
        destination: `${backendBase}/product/:path*`,
      },
      {
        source: '/order/:path*',
        destination: `${backendBase}/order/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
