import { cn } from "@/lib/utils";

export function Card({
  children,
  className
}: Readonly<{ children: React.ReactNode; className?: string }>) {
  return <div className={cn("glass-card", className)}>{children}</div>;
}
