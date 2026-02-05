import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/session";

export async function getUserDashboard() {
  const user = await getAuthUser();

  if (!user) {
    return {
      stats: [
        { label: "Total tools", value: "16", helper: "Available tools" },
        { label: "Files processed", value: "0", helper: "Sign in to track usage" },
        { label: "Plan", value: "Free", helper: "Upgrade for more" }
      ],
      recentFiles: [] as Array<{ id: string; filename: string; toolUsed: string; status: string }>
    };
  }

  const files = await prisma.files.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  const usageCount = await prisma.usageLogs.count({ where: { userId: user.id } });

  return {
    stats: [
      { label: "Total tools", value: "16", helper: "Available tools" },
      { label: "Files processed", value: usageCount.toString(), helper: "All-time usage" },
      { label: "Plan", value: user.planType, helper: "Upgrade anytime" }
    ],
    recentFiles: files.map((file) => ({
      id: file.id,
      filename: file.originalFilename,
      toolUsed: file.toolUsed,
      status: file.status
    }))
  };
}
