import type { ReactNode } from "react";

interface TipCardProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function TipCard({ title, description, action }: TipCardProps) {
  return (
    <div className="tip-card">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="tip-card-title">💡 {title}</h3>
          <p className="tip-card-content">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
