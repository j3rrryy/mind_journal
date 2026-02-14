import React from "react";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "danger" | "warning" | "success";
}

export const Card = React.memo(function Card({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  const baseClasses = "rounded-xl border p-5 shadow-sm transition-all";

  const variantClasses = {
    default: "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800",
    danger: "border-2 border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20",
    warning: "border-yellow-200 bg-yellow-50 dark:border-yellow-900 dark:bg-yellow-900/20",
    success: "border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20",
  };

  return <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>{children}</div>;
});
