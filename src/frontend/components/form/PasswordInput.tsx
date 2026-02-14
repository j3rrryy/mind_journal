"use client";

import { useState } from "react";
import { Input } from "./Input";
import { EyeIcon } from "@/components/icons/EyeIcon";
import { EyeCrossedIcon } from "@/components/icons/EyeCrossedIcon";

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

export default function PasswordInput({
  label,
  error,
  className = "",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={props.id} className="mb-2 block text-sm text-text-label">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <Input
          {...props}
          type={showPassword ? "text" : "password"}
          error={!!error}
          className={`pr-12 ${className}`}
        />
        <div className="absolute right-1 inset-y-0 flex items-center justify-center w-10 pointer-events-none">
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pointer-events-auto"
          >
            {showPassword ? (
              <EyeIcon className="w-5 h-5 text-text-muted" />
            ) : (
              <EyeCrossedIcon className="w-5 h-5 text-text-muted" />
            )}
          </button>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
