import React from "react";

interface LoadingDotsProps {
  size?: "sm" | "md" | "lg";
  fullPage?: boolean;
}

const dotSize = {
  sm: "0.5rem",
  md: "0.75rem",
  lg: "1rem",
};

export const LoadingDots = React.memo(function LoadingDots({
  size = "lg",
  fullPage = true,
}: LoadingDotsProps) {
  const content = (
    <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{
            width: dotSize[size],
            height: dotSize[size],
            backgroundColor: "currentColor",
            borderRadius: "9999px",
            display: "inline-block",
            boxShadow: "0 0 12px rgba(99,102,241,0.5)",
            opacity: 0.9,
            animation: `loadingDots 1.2s ease-in-out infinite ${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );

  if (!fullPage) {
    return content;
  }

  return <div className="flex min-h-screen items-center justify-center">{content}</div>;
});
