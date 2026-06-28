import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/online-toolbox1",
  assetPrefix: "/online-toolbox1/",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
