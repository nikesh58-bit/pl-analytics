/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { domains: ['images.sportmonks.com', 'media.api-sports.io', 'cdn.sportmonks.com', 'localhost', 'via.placeholder.com'], formats: ['image/avif', 'image/webp'] },
  experimental: { serverActions: true },
  async headers() { return [{ source: '/api/:path*', headers: [{ key: 'Access-Control-Allow-Credentials', value: 'true' }, { key: 'Access-Control-Allow-Origin', value: '*' }, { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' }, { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' }] }]; },
  async rewrites() { return [{ source: '/api/backend/:path*', destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/api/:path*` }]; },
};
module.exports = nextConfig;