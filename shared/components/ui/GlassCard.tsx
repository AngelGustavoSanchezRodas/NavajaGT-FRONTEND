import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/shared/lib/utils";

type GlassCardProps = HTMLAttributes<HTMLDivElement>;

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("glass-panel rounded-3xl p-6 sm:p-8", className)}
        {...props}
      />
    );
  }
);

GlassCard.displayName = "GlassCard";
