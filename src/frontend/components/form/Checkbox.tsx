"use client";

import { useId } from "react";

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  id?: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Checkbox({
  id,
  checked,
  onCheckedChange,
  className = "",
  ...props
}: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id || generatedId;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (props.disabled) return;
    onCheckedChange(e.target.checked);
  };

  return (
    <input
      id={checkboxId}
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      className={`h-5 w-5 appearance-none border border-gray-300 rounded bg-white dark:bg-gray-700 checked:bg-indigo-600 checked:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:border-gray-600 dark:checked:bg-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
