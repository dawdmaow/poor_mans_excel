import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/poor_mans_excel',
  assetPrefix: '/poor_mans_excel/',
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
