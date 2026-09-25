import * as React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const variantClasses: Record<ButtonVariant, string> = {
  default: "bg-indigo-600 text-white shadow hover:bg-indigo-500 shadow-indigo-600/20",
  destructive: "bg-red-500 text-slate-50 shadow-sm hover:bg-red-600 shadow-red-500/20",
  outline: "border border-slate-700 bg-transparent shadow-sm hover:bg-slate-800 text-slate-100",
  secondary: "bg-slate-800 text-slate-100 shadow-sm hover:bg-slate-700",
  ghost: "hover:bg-slate-800 text-slate-100",
  link: "text-indigo-400 underline-offset-4 hover:underline",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-9 px-4 py-2 text-sm",
  sm: "h-8 rounded-md px-3 text-xs",
  lg: "h-10 rounded-md px-8 text-base",
  icon: "h-9 w-9 p-0 flex items-center justify-center",
};

export function buttonVariants({
  variant = 'default',
  size = 'default',
  className
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200 cursor-pointer",
    variantClasses[variant] || variantClasses.default,
    sizeClasses[size] || sizeClasses.default,
    className
  );
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

