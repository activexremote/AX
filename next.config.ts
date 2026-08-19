import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  sassOptions: {
    includePaths: [path.join(process.cwd(), "node_modules")],
    // "mixed-decls" ya no es una deprecación de Sass: seguir silenciándola
    // es justo lo que hacía saltar un aviso en cada .scss del proyecto.
    silenceDeprecations: ["global-builtin", "import"],
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
