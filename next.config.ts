import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static exports
  output: 'export',
  // Foldered routes (about-us/index.html) so GitHub Pages
  // serves /about-us/ directly and 301s /about-us -> /about-us/
  trailingSlash: true,
  images: {
    // Required for static export
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
