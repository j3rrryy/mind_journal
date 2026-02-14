"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface NavLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export function NavLink({ href, children, className = "" }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`
        flex items-center gap-2 rounded-lg px-4 py-2 text-sm transition-colors
        ${isActive ? "text-link-active" : "text-link-inactive-primary"}
        ${className}
      `}
    >
      {children}
    </Link>
  );
}
