"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", ...props }, ref) => {
    const variants = {
      primary: "bg-(--color-accent) text-(--color-on-accent) hover:opacity-90 disabled:opacity-50",
      secondary:
        "bg-(--color-surface) text-(--color-text) border border-(--color-border) hover:bg-(--color-bg) disabled:opacity-50",
      outline:
        "border border-(--color-border) bg-transparent text-(--color-text) hover:bg-(--color-surface) disabled:opacity-50",
      danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-50",
      ghost:
        "bg-transparent hover:bg-(--color-surface) text-(--color-text) disabled:opacity-50",
    };

    return (
      <button
        ref={ref}
        className={clsx(
          "inline-flex items-center justify-center rounded px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-(--color-accent) focus:ring-offset-2 disabled:cursor-not-allowed",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";

export default Button;
