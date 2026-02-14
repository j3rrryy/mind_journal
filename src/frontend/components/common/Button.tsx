import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "danger-secondary"
    | "warning"
    | "white"
    | "outline";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  href?: string;
}

const variantClasses = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600",
  secondary:
    "border border-gray-300 bg-white text-text-primary hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-text-primary dark:hover:bg-gray-700",
  danger: "bg-red-600 text-white hover:bg-red-700",
  "danger-secondary":
    "border border-red-200 bg-white text-red-600 hover:bg-red-100 dark:border-red-500 dark:bg-gray-800 dark:text-text-primary dark:hover:bg-red-900/30",
  warning:
    "bg-yellow-500 text-white hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700",
  white: "bg-white text-indigo-600 hover:bg-indigo-50 hover:shadow-lg",
  outline: "border-2 border-white text-white hover:bg-white/10",
};

const sizeClasses = {
  sm: "px-3 py-1 text-sm",
  md: "px-4 py-2",
  lg: "px-5 py-3",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  href,
  ...props
}: ButtonProps) {
  const classNames = `inline-flex items-center justify-center rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-indigo-400 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classNames}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classNames} {...props}>
      {children}
    </button>
  );
}
