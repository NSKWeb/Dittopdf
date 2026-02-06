import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";
import { processPdfTool } from "@/lib/pdf-tools";
import { uploadFile } from "@/lib/storage";
import { rateLimit } from "@/lib/rate-limit";
import { getClientId } from "@/lib/request";
import { tools } from "@/lib/tools";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request, { params }: { params: { tool: string } }) {
  try {
    const limiter = rateLimit(getClientId(), 20, 60_000);
    if (!limiter.allowed) {
      return NextResponse.json(
        { message: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    if (!tools.some((tool) => tool.slug === params.tool)) {
      return NextResponse.json(
        { message: "Unknown tool. Please select a valid PDF tool." },
        { status: 404 }
      );
    }

    const authUser = await getAuthUser();
    const formData = await request.formData();
    const files = formData.getAll("files").filter((file): file is File => file instanceof File);
    const instructions = formData.get("instructions")?.toString();

    if (!files.length) {
      return NextResponse.json(
        { message: "No files uploaded. Please select at least one file." },
        { status: 400 }
      );
    }

    const allowedTypes = ["application/pdf", "image/png", "image/jpeg"];
    const maxFileSize = 25 * 1024 * 1024;

    for (const file of files) {
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { message: `File "${file.name}" is too large. Maximum size is 25MB.` },
          { status: 400 }
        );
      }
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { message: `File "${file.name}" has unsupported type. Allowed: PDF, PNG, JPG.` },
          { status: 400 }
        );
      }
    }

    const userRecord = authUser ? await prisma.users.findUnique({ where: { id: authUser.id } }) : null;
    const now = new Date();
    const shouldReset = userRecord
      ? now.getTime() - userRecord.lastResetDate.getTime() >= 24 * 60 * 60 * 1000
      : false;
    const dailyUsage = userRecord ? (shouldReset ? 0 : userRecord.usageCount) : 0;

    if (userRecord?.planType === "Free" && dailyUsage >= 5) {
      return NextResponse.json(
        {
          message:
            "Daily limit reached (5 files). Upgrade to Pro for unlimited processing.",
          upgradeUrl: "/dashboard"
        },
        { status: 403 }
      );
    }

    const result = await processPdfTool({ tool: params.tool, files, instructions });
    const key = `${authUser?.id ?? "guest"}-${Date.now()}-${result.filename}`;
    const upload = await uploadFile({
      key,
      body: result.buffer,
      contentType: result.contentType
    });

    if (authUser && userRecord) {
      await prisma.$transaction([
        prisma.files.create({
          data: {
            userId: authUser.id,
            originalFilename: files[0].name,
            processedFilename: result.filename,
            fileSize: result.buffer.length,
            toolUsed: params.tool,
            status: "processed"
          }
        }),
        prisma.usageLogs.create({
          data: {
            userId: authUser.id,
            toolUsed: params.tool,
            fileSize: result.buffer.length
          }
        }),
        prisma.users.update({
          where: { id: authUser.id },
          data: shouldReset
            ? { usageCount: 1, lastResetDate: now }
            : { usageCount: { increment: 1 } }
        })
      ]);
    }

    return NextResponse.json({
      message: "Processing complete",
      downloadUrl: upload.url,
      filename: result.filename
    });
  } catch (error) {
    console.error("Tool processing error:", error);
    const message =
      error instanceof Error
        ? error.message
        : "An error occurred while processing your file. Please try again.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
