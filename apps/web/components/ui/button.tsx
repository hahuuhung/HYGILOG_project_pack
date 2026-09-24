import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export type ButtonVariant = 
  | "default" 
  | "primary" 
  | "destructive" 
  | "danger" 
  | "outline" 
  | "secondary" 
  | "ghost" 
  | "link";

export type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-indigo-600 text-white shadow hover:bg-indigo-500",
  primary: "bg-indigo-600 text-white shadow hover:bg-indigo-500",
  destructive: "bg-rose-600 text-white shadow-sm hover:bg-rose-500",
  danger: "bg-rose-600 text-white shadow-sm hover:bg-rose-500",
  outline: "border border-slate-700 bg-transparent shadow-sm hover:bg-slate-800 text-slate-100",
  secondary: "bg-slate-800 text-slate-100 shadow-sm hover:bg-slate-700",
  ghost: "hover:bg-slate-800 text-slate-100",
  link: "text-indigo-400 underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 rounded-lg px-3 text-xs",
  lg: "h-11 rounded-xl px-8 text-base",
  icon: "h-9 w-9 p-0",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={loading || disabled}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
