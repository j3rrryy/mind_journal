import React from "react";

interface ChangeIndicatorProps {
  change: number;
  className?: string;
}

export const ChangeIndicator = React.memo(function ChangeIndicator({
  change,
  className = "",
}: ChangeIndicatorProps) {
  const arrow = change > 0 ? "▲" : "▼";
  const displayValue = change.toFixed(1);

  return (
    <span className={`inline-flex items-center gap-1 font-bold ${className}`}>
      <span>{arrow}</span>
      {displayValue}
    </span>
  );
});
