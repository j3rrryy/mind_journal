import type { ReactNode } from "react";
import { Card } from "@/components/layout/Card";

interface SectionCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  variant?: "default" | "danger";
  action?: ReactNode;
}

const titleColorClasses = {
  default: "text-text-primary",
  danger: "text-red-900 dark:text-red-300",
};

export function SectionCard({
  title,
  children,
  className,
  variant = "default",
  action,
}: SectionCardProps) {
  return (
    <Card variant={variant} className={className}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className={`text-xl font-semibold ${titleColorClasses[variant]}`}>{title}</h2>
        {action}
      </div>
      {children}
    </Card>
  );
}
