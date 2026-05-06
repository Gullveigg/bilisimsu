"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Animation = "fade-up" | "fade-in" | "slide-left" | "slide-right" | "scale-in";
type Delay = 0 | 100 | 200 | 300 | 400 | 500;

export function AnimateSection({
  children,
  className,
  animation = "fade-up",
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  animation?: Animation;
  delay?: Delay;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(`anim-${animation}`, delay > 0 && `anim-delay-${delay}`, className)}
    >
      {children}
    </div>
  );
}
