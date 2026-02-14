import type { ReactNode } from "react";
import { Logo } from "../icons/Logo";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center">
          <Logo size={52} />
          <h1 className="mt-5 text-4xl font-bold text-text-primary">MindJournal</h1>
        </div>
        <div className="rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-800">{children}</div>
      </div>
    </div>
  );
}
