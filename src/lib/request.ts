import { headers } from "next/headers";

export function getClientId() {
  const headerList = headers();
  return (
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    headerList.get("x-real-ip") ??
    "anonymous"
  );
}
