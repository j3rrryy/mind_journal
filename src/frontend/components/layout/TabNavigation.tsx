"use client";

export interface TabItem {
  id: string;
  label: string;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  variant?: "underline" | "pills";
  size?: "sm" | "md" | "lg";
}

const variantClasses = {
  underline: {
    container: "border-b border-gray-200 dark:border-gray-700",
    tab: (isActive: boolean) => `
      px-4 py-2.5 text-sm font-medium border-b-2 transition-colors
      ${
        isActive
          ? "border-indigo-500 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400"
          : "border-transparent text-text-secondary hover:text-text-label hover:border-gray-300 dark:text-text-muted dark:hover:text-text-secondary"
      }
    `,
  },
  pills: {
    container: "flex gap-1",
    tab: (isActive: boolean) => `
      px-4 py-2 text-sm font-medium rounded-lg transition-colors
      ${
        isActive
          ? "bg-indigo-500 text-white dark:bg-indigo-600"
          : "bg-gray-100 text-text-secondary hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
      }
    `,
  },
};

const sizeClasses = {
  sm: "text-xs px-3 py-1.5",
  md: "text-sm px-4 py-2",
  lg: "text-base px-5 py-2.5",
};

export function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  variant = "underline",
  size = "md",
}: TabNavigationProps) {
  const styles = variantClasses[variant];

  return (
    <div className={`${styles.container} ${className}`}>
      <nav className="flex gap-1 -mb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`${styles.tab(activeTab === tab.id)} ${sizeClasses[size]}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
