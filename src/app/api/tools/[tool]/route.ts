import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { processPdfTool } from "@/lib/pdf-tools";
import { uploadFile } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";
import { getClientId } from "@/lib/request";
import { tools } from "@/lib/tools";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: { tool: string } }) {
  const limiter = rateLimit(getClientId(), 20, 60_000);
  if (!limiter.allowed) {
    return NextResponse.json({ message: "Too many requests" }, { status: 429 });
  }

  if (!tools.some((tool) => tool.slug === params.tool)) {
    return NextResponse.json({ message: "Unknown tool" }, { status: 404 });
  }

  const authUser = await getAuthUser();
  const formData = await request.formData();
  const files = formData.getAll("files").filter((file): file is File => file instanceof File);
  const instructions = formData.get("instructions")?.toString();

  if (!files.length) {
    return NextResponse.json({ message: "No files uploaded" }, { status: 400 });
  }

  const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
  for (const file of files) {
    if (file.size > 25 * 1024 * 1024) {
      return NextResponse.json({ message: "File too large. Max 25MB." }, { status: 400 });
    }
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ message: "Unsupported file type" }, { status: 400 });
    }
  }

  const result = await processPdfTool({ tool: params.tool, files, instructions });
  const key = `${Date.now()}-${result.filename}`;
  const upload = await uploadFile({
    key,
    body: result.buffer,
    contentType: result.contentType
  });

  if (authUser) {
    await prisma.files.create({
      data: {
        userId: authUser.id,
        originalFilename: files[0].name,
        processedFilename: result.filename,
        fileSize: result.buffer.length,
        toolUsed: params.tool,
        status: "processed"
      }
    });
    await prisma.usageLogs.create({
      data: {
        userId: authUser.id,
        toolUsed: params.tool,
        fileSize: result.buffer.length
      }
    });
  }

  return NextResponse.json({
    message: "Processing complete",
    downloadUrl: upload.url
  });
}
