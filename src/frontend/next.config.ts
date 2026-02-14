import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");
const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || "";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    serverActions: {
      allowedOrigins: allowedOriginsEnv.split(",").map((origin) => origin.trim()),
    },
  },
};

export default withNextIntl(nextConfig);
