import { getServerLocale } from "@/lib/auth/server";
import { redirect } from "next/navigation";

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: { token: string };
}) {
  const { token } = await searchParams;
  const locale = await getServerLocale();
  redirect(`/${locale}/auth/confirm-email?token=${token}`);
}
