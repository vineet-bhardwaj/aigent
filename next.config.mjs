/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  // Serve the self-contained report HTML files (in /public/reports) at clean,
  // extension-less URLs, e.g. /reports/kathryn-minniehan.
  async rewrites() {
    return [
      {
        source: '/reports/:slug',
        destination: '/reports/:slug.html',
      },
    ];
  },
};

export default nextConfig;
