import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: process.env.ALLOWED_DEV_ORIGIN
    ? process.env.ALLOWED_DEV_ORIGIN.split(',').map((s) => s.trim())
    : ['localhost', '127.0.0.1'],
};

export default nextConfig;
