import * as React from "react";
import { cn } from "@/lib/utils";

export type BadgeVariant = 
  | "default" 
  | "primary" 
  | "secondary" 
  | "destructive" 
  | "danger" 
  | "outline" 
  | "success" 
  | "warning";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "border-slate-700 bg-slate-800 text-slate-300",
  primary: "border-indigo-500/30 bg-indigo-500/20 text-indigo-300",
  secondary: "border-slate-700 bg-slate-800 text-slate-100",
  destructive: "border-rose-500/30 bg-rose-500/20 text-rose-300",
  danger: "border-rose-500/30 bg-rose-500/20 text-rose-300",
  outline: "text-slate-300 border-slate-700 bg-transparent",
  success: "border-emerald-500/30 bg-emerald-500/20 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-500/20 text-amber-300",
};

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-lg border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none",
        variantClasses[variant],
        className
      )} 
      {...props} 
    />
  );
}

export { Badge };
