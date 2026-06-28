import type { NextConfig } from "next";

const repository = "signal-builder";
const isProduction = process.env.NODE_ENV === "production";
const buildTimestamp = process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || "local-dev";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProduction ? `/${repository}` : "",
  assetPrefix: isProduction ? `/${repository}/` : "",
  env: {
    NEXT_PUBLIC_BUILD_TIMESTAMP: buildTimestamp,
  },
};

export default nextConfig;
