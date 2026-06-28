import type { NextConfig } from "next";

const repository = "signal-builder";
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProduction ? `/${repository}` : "",
  assetPrefix: isProduction ? `/${repository}/` : "",
};

export default nextConfig;
