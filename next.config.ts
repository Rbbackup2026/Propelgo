import type { NextConfig } from "next";

const cmsUrl = (process.env.CMS_URL ?? "https://propelgo-cms.vercel.app").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    if (!cmsUrl) return [];

    return [
      { source: "/admin", destination: `${cmsUrl}/admin` },
      { source: "/admin/:path+", destination: `${cmsUrl}/admin/:path+` },
      { source: "/api/admin/:path+", destination: `${cmsUrl}/api/admin/:path+` },
      { source: "/admin-static/:path+", destination: `${cmsUrl}/admin-static/:path+` },
    ];
  },
};

export default nextConfig;
