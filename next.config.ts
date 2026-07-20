import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Docker standalone output — creates a self-contained production build
  output: 'standalone',
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGIN
    ? process.env.ALLOWED_DEV_ORIGIN.split(',').map((s) => s.trim())
    : ['localhost', '127.0.0.1'],
  // Mark ogl as external to prevent Turbopack from re-bundling it on every refresh
  serverExternalPackages: ['ogl'],
  turbopack: {
    // Reduce file-watching overhead on slow filesystems
    resolveExtensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
};

export default nextConfig;
