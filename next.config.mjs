/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    // For Vercel, use environment variables or fallback to localhost for dev
    const billingUrl = process.env.NEXT_PUBLIC_BILLING_URL || process.env.BILLING_URL || 'http://localhost:3001';
    const connectUrl = process.env.NEXT_PUBLIC_CONNECT_URL || process.env.CONNECT_URL || 'http://localhost:3002';
    
    // Only add rewrites if we're not in production on Vercel (Vercel handles rewrites via vercel.json)
    if (process.env.VERCEL) {
      return [];
    }
    
    return [
      {
        source: '/billing/:path*',
        destination: `${billingUrl}/:path*`,
      },
      {
        source: '/connect/:path*',
        destination: `${connectUrl}/:path*`,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

