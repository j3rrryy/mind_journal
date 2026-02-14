import React from "react";
import type { Priority } from "@/lib/constants/priority";
import { getPriorityColorClasses, getPriorityLabel } from "@/lib/utils/priority";
import { useLocale } from "next-intl";

interface PriorityBadgeProps {
  priority: Priority;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const PriorityBadge = React.memo(function PriorityBadge({
  priority,
  size = "md",
}: PriorityBadgeProps) {
  const locale = useLocale();
  const colorClasses = getPriorityColorClasses(priority);

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`inline-flex items-center rounded-full ${colorClasses} ${sizeClasses}`}>
      {getPriorityLabel(priority, locale)}
    </span>
  );
});
