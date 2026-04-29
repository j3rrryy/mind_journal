import type { ReactNode } from "react";
import { Lightbulb } from "lucide-react";

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
          <h3 className="tip-card-title flex items-center gap-2">
            <Lightbulb size={20} className="text-yellow-600 dark:text-yellow-400" />
            {title}
          </h3>
          <p className="tip-card-content">{description}</p>
        </div>
        {action}
      </div>
    </div>
  );
}
