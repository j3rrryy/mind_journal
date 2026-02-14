import { headers } from "next/headers";

export async function getClientInfo() {
  const headersList = await headers();
  const forwarded = headersList.get("X-Forwarded-For")?.replace(/^::ffff:/, "");
  const userAgent = headersList.get("User-Agent");
  return { forwarded, userAgent };
}
