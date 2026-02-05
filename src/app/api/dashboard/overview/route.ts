import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";

export async function GET() {
  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const [usageCount, files] = await Promise.all([
    prisma.usageLogs.count({ where: { userId: authUser.id } }),
    prisma.files.findMany({
      where: { userId: authUser.id },
      orderBy: { createdAt: "desc" },
      take: 10
    })
  ]);

  return NextResponse.json({
    usageCount,
    files
  });
}
