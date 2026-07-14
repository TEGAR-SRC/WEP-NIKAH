import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "@aws-sdk/client-s3",
    "@prisma/adapter-pg",
    "@prisma/adapter-libsql",
    "@whiskeysockets/baileys",
    "sharp",
    "jimp",
  ],
};

export default nextConfig;
