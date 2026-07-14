import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@aws-sdk/client-s3",
    "@prisma/adapter-pg",
    "@prisma/adapter-libsql",
    "@whiskeysockets/baileys",
    "sharp",
    "jimp",
    "pino",
  ],
};

if (process.env.NODE_ENV === "development") {
  await setupDevPlatform();
}

export default nextConfig;
