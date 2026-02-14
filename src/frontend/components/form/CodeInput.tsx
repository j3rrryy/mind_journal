"use client";

import { useRef, useCallback, KeyboardEvent, ClipboardEvent } from "react";
import { RESET_CODE_LENGTH } from "@/lib/constants/validation";

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function CodeInput({ value, onChange, disabled, error }: CodeInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.split("").concat(Array(RESET_CODE_LENGTH - value.length).fill(""));

  const focusInput = useCallback((index: number) => {
    const i = Math.max(0, Math.min(index, RESET_CODE_LENGTH - 1));
    inputRefs.current[i]?.focus();
  }, []);

  const handleChange = useCallback(
    (index: number, char: string) => {
      if (!/^\d*$/.test(char)) return;
      const arr = digits.slice();
      arr[index] = char.slice(-1);
      const newValue = arr.join("").slice(0, RESET_CODE_LENGTH);
      onChange(newValue);
      if (char && index < RESET_CODE_LENGTH - 1) {
        focusInput(index + 1);
      }
    },
    [digits, onChange, focusInput]
  );

  const handleKeyDown = useCallback(
    (index: number, e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        focusInput(index - 1);
        const arr = digits.slice();
        arr[index - 1] = "";
        onChange(arr.join(""));
      }
    },
    [digits, onChange, focusInput]
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, RESET_CODE_LENGTH);
      if (pasted) {
        onChange(pasted);
        focusInput(Math.min(pasted.length, RESET_CODE_LENGTH - 1));
      }
    },
    [onChange, focusInput]
  );

  return (
    <div className="flex justify-center gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`h-14 w-12 rounded-xl border-2 text-center text-xl font-semibold tabular-nums transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 ${
            error
              ? "border-red-500 bg-red-50 dark:border-red-600 dark:bg-red-900/20"
              : "border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          }`}
          aria-label={`Digit ${index + 1}`}
        />
      ))}
    </div>
  );
}
