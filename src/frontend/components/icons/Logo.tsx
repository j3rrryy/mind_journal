import { SVGProps } from "react";

interface LogoProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function Logo({ size = 36, ...props }: LogoProps) {
  return (
    <svg width={size} height={size} viewBox="5 5 30 30" fill="none" {...props}>
      <line
        x1="20"
        y1="8"
        x2="32"
        y2="20"
        strokeWidth="1"
        strokeOpacity="0.4"
        className="stroke-indigo-500 dark:stroke-white"
      />
      <line
        x1="8"
        y1="20"
        x2="20"
        y2="8"
        strokeWidth="1"
        strokeOpacity="0.4"
        className="stroke-indigo-500 dark:stroke-white"
      />
      <line
        x1="32"
        y1="20"
        x2="20"
        y2="32"
        strokeWidth="1"
        strokeOpacity="0.4"
        className="stroke-indigo-500 dark:stroke-white"
      />
      <line
        x1="8"
        y1="20"
        x2="20"
        y2="32"
        strokeWidth="1"
        strokeOpacity="0.4"
        className="stroke-indigo-500 dark:stroke-white"
      />

      <line
        x1="14"
        y1="14"
        x2="26"
        y2="26"
        strokeWidth="1"
        strokeOpacity="0.4"
        className="stroke-indigo-500 dark:stroke-white"
      />
      <line
        x1="26"
        y1="14"
        x2="14"
        y2="26"
        strokeWidth="1"
        strokeOpacity="0.4"
        className="stroke-indigo-500 dark:stroke-white"
      />

      <circle cx="20" cy="8" r="2" className="fill-indigo-700 dark:fill-white" />
      <circle cx="8" cy="20" r="2" className="fill-indigo-700 dark:fill-white" />
      <circle cx="32" cy="20" r="2" className="fill-indigo-700 dark:fill-white" />
      <circle cx="20" cy="32" r="2" className="fill-indigo-700 dark:fill-white" />

      <circle cx="20" cy="20" r="2.5" className="fill-indigo-700 dark:fill-white" />

      <circle
        cx="14"
        cy="14"
        r="1.5"
        className="fill-indigo-600 dark:fill-white"
        fillOpacity="0.7"
      />
      <circle
        cx="26"
        cy="14"
        r="1.5"
        className="fill-indigo-600 dark:fill-white"
        fillOpacity="0.7"
      />
      <circle
        cx="14"
        cy="26"
        r="1.5"
        className="fill-indigo-600 dark:fill-white"
        fillOpacity="0.7"
      />
      <circle
        cx="26"
        cy="26"
        r="1.5"
        className="fill-indigo-600 dark:fill-white"
        fillOpacity="0.7"
      />
    </svg>
  );
}
