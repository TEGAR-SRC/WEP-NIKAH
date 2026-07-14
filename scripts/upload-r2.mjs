import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

const S3 = new S3Client({
  endpoint: "https://b09d0a9768ae1cb2f77fea7135fd637d.r2.cloudflarestorage.com",
  region: "auto",
  credentials: {
    accessKeyId: "24b424a03f027b44a85bfde7d88d47bc",
    secretAccessKey: "4e4a8a2c9fb98617701b51f78c81fc3a8832a567a99bc9c618f62b5e47e54f83",
  },
});

const BUCKET = "nikah";
const BASE = join(import.meta.dirname, "..", "public");

const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".woff2": "font/woff2",
  ".css": "text/css",
};

function walk(dir) {
  const entries = readdirSync(dir);
  const files = [];
  for (const e of entries) {
    const p = join(dir, e);
    if (statSync(p).isDirectory()) files.push(...walk(p));
    else files.push(p);
  }
  return files;
}

async function upload(file) {
  const relative = file.replace(BASE + "\\", "").replace(/\\/g, "/");
  const Key = `public/${relative}`;
  const Body = readFileSync(file);
  const ContentType = MIME[extname(file).toLowerCase()] ?? "application/octet-stream";

  try {
    await S3.send(new HeadObjectCommand({ Bucket: BUCKET, Key }));
    console.log(`SKIP ${Key} (exists)`);
    return;
  } catch {}

  await S3.send(new PutObjectCommand({ Bucket: BUCKET, Key, Body, ContentType }));
  console.log(`OK   ${Key}`);
}

const files = walk(BASE);
for (const f of files) await upload(f);
console.log(`\nDone. ${files.length} files processed.`);
