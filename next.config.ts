import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // High-res flipbook pages are sent as base64 JSON and can exceed the 10MB default.
    middlewareClientMaxBodySize: "100mb",
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;