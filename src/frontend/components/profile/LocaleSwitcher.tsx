"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.replace(newPath);
  };

  return (
    <div className="flex items-center gap-2 pl-4">
      <button
        onClick={() => switchLocale("ru")}
        className={`px-2 py-1 rounded-lg transition-colors inline-flex items-center gap-2 ${
          locale === "ru" ? "text-link-active" : "text-link-inactive"
        }`}
      >
        <Image src="/flags/flag-ru.svg" alt="RU" width={20} height={20} unoptimized />
        <span className="hidden sm:inline">RU</span>
      </button>
      <button
        onClick={() => switchLocale("en")}
        className={`px-2 py-1 rounded-lg transition-colors inline-flex items-center gap-2 ${
          locale === "en" ? "text-link-active" : "text-link-inactive"
        }`}
      >
        <Image src="/flags/flag-gb.svg" alt="GB" width={20} height={20} unoptimized />
        <span className="hidden sm:inline">EN</span>
      </button>
    </div>
  );
}
