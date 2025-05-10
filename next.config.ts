import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/poor_mans_excel',
  // assetPrefix: '/poor_mans_excel/',
  images: {
    unoptimized: true,
  },
  // trailingSlash: true,
  // // Ensure all assets are properly loaded
  // webpack: (config) => {
  //   config.output.publicPath = '/poor_mans_excel/';
  //   return config;
  // },
  /* config options here */
};

export default nextConfig;
