"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Logo } from "../icons/Logo";
import { NavLink } from "./NavLink";

export default function Navigation() {
  const pathname = usePathname();
  const t = useTranslations("nav");
  const locale = useLocale();

  const isActive = (href: string) => pathname === href;

  const navItems = [
    { href: `/${locale}/dashboard`, label: t("dashboard"), icon: "📊" },
    { href: `/${locale}/calendar`, label: t("calendar"), icon: "📅" },
    { href: `/${locale}/analytics`, label: t("analytics"), icon: "📈" },
    { href: `/${locale}/recommendations`, label: t("recommendations"), icon: "💡" },
    { href: `/${locale}/profile`, label: t("profile"), icon: "👤" },
  ];

  return (
    <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href={`/${locale}/dashboard`} className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-bold text-text-primary">MindJournal</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navItems.slice(0, 4).map((item) => (
              <NavLink key={item.href} href={item.href}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <NavLink href={`/${locale}/profile`}>
            <span>👤</span>
            <span className="hidden sm:inline">{t("profile")}</span>
          </NavLink>
        </div>
      </div>

      <div className="border-t border-gray-200 lg:hidden dark:border-gray-700">
        <div className="flex justify-around py-2">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors ${
                isActive(item.href) ? "text-indigo-700 dark:text-indigo-300" : "text-text-secondary"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
