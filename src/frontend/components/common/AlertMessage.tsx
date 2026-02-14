import type { ReactNode } from "react";
import { Card } from "@/components/layout/Card";

interface AlertMessageProps {
  message: ReactNode;
  variant?: "danger" | "success" | "warning";
  action?: ReactNode;
}

const messageColorClasses = {
  danger: "text-red-800 dark:text-red-300",
  success: "text-green-800 dark:text-green-300",
  warning: "text-yellow-800 dark:text-yellow-300",
};

export function AlertMessage({ message, variant = "danger", action }: AlertMessageProps) {
  return (
    <Card variant={variant} className="p-3 mb-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className={`flex-1 break-words ${messageColorClasses[variant]}`}>{message}</p>
        {action}
      </div>
    </Card>
  );
}
