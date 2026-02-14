"use client";

export default function CountryIndicator({ countryCode }: { countryCode?: string | null }) {
  if (countryCode) {
    return (
      <span className="inline-flex items-center gap-2 text-sm text-text-muted">
        <span className="text-text-muted dark:text-text-muted text-base">●</span>
        <span>{countryCode}</span>
      </span>
    );
  }
}
