import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Served under the main site's domain via rewrites, so assets need their own prefix.
  assetPrefix: "/admin-static",
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
