"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  inputSize?: "sm" | "md" | "lg";
  error?: boolean;
}

const sizeClasses = {
  sm: "px-4 py-2",
  md: "px-4 py-2.5",
  lg: "px-4 py-3",
};

export function Input({ inputSize = "lg", error, className = "", ...props }: InputProps) {
  return (
    <input
      className={`
        w-full rounded-lg border bg-white text-text-primary
        transition-colors
        focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500
        dark:bg-gray-700 dark:text-white dark:focus:border-indigo-400 dark:focus:ring-indigo-400
        ${
          error
            ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
            : "border-gray-300 dark:border-gray-600"
        }
        ${sizeClasses[inputSize]}
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      {...props}
    />
  );
}
