import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Tokens } from "@/types";
import { defaultLocale } from "@/i18n";

export async function getServerLocale(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get("user_locale")?.value || defaultLocale;
}

export async function redirectToLogin(): Promise<never> {
  const locale = await getServerLocale();
  redirect(`/${locale}/auth/login`);
}

export async function getServerAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("access_token")?.value || null;
}

export async function getServerRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("refresh_token")?.value || null;
}

export async function setServerTokens(tokens: Tokens): Promise<void> {
  const cookieStore = await cookies();
  const headersList = await headers();
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const isSecure = protocol === "https";

  cookieStore.set("access_token", tokens.access_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: 60 * 15,
    path: "/",
  });

  cookieStore.set("refresh_token", tokens.refresh_token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function clearServerTokens(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}
