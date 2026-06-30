import { cn } from "@/lib/utils";

export function SectionFallback({
  className,
  minHeight = "40vh",
}: {
  className?: string;
  minHeight?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn("w-full animate-pulse rounded-2xl bg-surface/40", className)}
      style={{ minHeight }}
    />
  );
}
