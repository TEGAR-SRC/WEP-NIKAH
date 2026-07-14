import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

const S3 = new S3Client({
  endpoint: process.env.R2_ENDPOINT!,
  region: "auto",
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET = process.env.R2_BUCKET!;

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const Key = path.join("/");

  try {
    const { Body, ContentType, ContentLength } = await S3.send(new GetObjectCommand({ Bucket: BUCKET, Key }));
    const stream = Body as ReadableStream;
    return new Response(stream, {
      headers: {
        "Content-Type": ContentType ?? "application/octet-stream",
        "Content-Length": String(ContentLength ?? 0),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
