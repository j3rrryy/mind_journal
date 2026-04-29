import React from "react";
import type { ReactNode } from "react";
import { BarChart3, Search, TrendingUp } from "lucide-react";

interface EmptyStateProps {
  icon?: "chart" | "search" | "trend" | "";
  title: string;
  description?: string;
  action?: ReactNode;
}

const icons = {
  chart: BarChart3,
  search: Search,
  trend: TrendingUp,
};

export const EmptyState = React.memo(function EmptyState({
  icon = "chart",
  title,
  description,
  action,
}: EmptyStateProps) {
  const IconComponent = icon ? icons[icon] : null;

  return (
    <div className="flex flex-col items-center justify-center rounded-xl card-surface p-12 text-center">
      {IconComponent && (
        <div className="mb-4 text-text-secondary">
          <IconComponent size={48} />
        </div>
      )}
      <h3 className="mb-2 text-lg font-semibold text-text-primary">{title}</h3>
      {description && <p className="max-w-md text-text-secondary">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
});
