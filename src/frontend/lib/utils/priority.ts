import type { Priority } from "@/lib/constants/priority";
import { PRIORITY_COLORS, PRIORITY_ORDER, PRIORITY_LABELS } from "@/lib/constants/priority";

export function getPriorityColorClasses(priority: Priority): string {
  const colors = PRIORITY_COLORS[priority];
  return `${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}`;
}

export function getPriorityLabel(priority: Priority, locale: string = "ru"): string {
  return PRIORITY_LABELS[priority][locale as keyof (typeof PRIORITY_LABELS)[Priority]] || priority;
}

export function sortByPriority<T extends { priority: Priority }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    return PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority);
  });
}

export function isHigherPriority(a: Priority, b: Priority): boolean {
  return PRIORITY_ORDER.indexOf(a) < PRIORITY_ORDER.indexOf(b);
}
