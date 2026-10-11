import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "cyan" | "violet" | "outline" | "success" | "warning";
}

export function Badge({
  children,
  className,
  variant = "primary",
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide";

  const variantStyles = {
    primary: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    secondary: "bg-slate-800 text-slate-300 border border-slate-700",
    cyan: "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30",
    violet: "bg-violet-500/15 text-violet-300 border border-violet-500/30",
    outline: "text-slate-400 border border-slate-700/80",
    success: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
}
