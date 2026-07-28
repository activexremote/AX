import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "node_modules")],
    silenceDeprecations: ["mixed-decls", "global-builtin", "import"],
  },
  transpilePackages: ["@carbon/react", "@carbon/icons-react", "@carbon/styles"],
  experimental: {
    optimizePackageImports: ["@carbon/react", "@carbon/icons-react"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "jzmllhwkplpfmjddqknh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
