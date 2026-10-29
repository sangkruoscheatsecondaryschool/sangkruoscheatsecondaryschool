import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          {
            "bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm": variant === "primary",
            "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-400": variant === "secondary",
            "border border-slate-300 bg-transparent hover:bg-slate-50 text-slate-700 focus:ring-slate-400": variant === "outline",
            "bg-transparent hover:bg-slate-100 text-slate-700": variant === "ghost",
            "bg-danger-500 text-white hover:bg-red-600 focus:ring-red-400 shadow-sm": variant === "danger",
            "h-9 px-3 text-sm": size === "sm",
            "h-11 px-5 py-2": size === "md",
            "h-14 px-8 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";