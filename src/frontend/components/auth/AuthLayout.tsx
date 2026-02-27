import type { ReactNode } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Logo } from "../icons/Logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const locale = useLocale();

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <Link href={`/${locale}`} className="mb-8 flex flex-col items-center justify-center">
          <Logo size={52} />
          <h1 className="mt-5 text-4xl font-bold text-text-primary">MindJournal</h1>
        </Link>
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">{children}</div>
      </div>
    </div>
  );
}
