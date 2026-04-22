import { cn } from "@/shared/lib/utils";

type BackgroundGlowColor = "turquoise" | "mustard" | "magenta";

type BackgroundGlowProps = {
  color: BackgroundGlowColor;
  className?: string;
};

const colorClasses: Record<BackgroundGlowColor, string> = {
  turquoise: "bg-brand-turquoise",
  mustard: "bg-brand-mustard",
  magenta: "bg-brand-magenta",
};

export function BackgroundGlow({ color, className }: BackgroundGlowProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-[100px] opacity-20",
        colorClasses[color],
        className
      )}
    />
  );
}
