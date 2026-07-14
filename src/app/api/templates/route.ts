import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const templates = await prisma.template.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(templates);
}

export async function POST(req: NextRequest) {
  const { name, subject, body } = await req.json();
  const template = await prisma.template.create({ data: { name, subject, body } });
  return NextResponse.json(template, { status: 201 });
}
