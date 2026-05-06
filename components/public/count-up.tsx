"use client";

import { useEffect, useRef, useState } from "react";

function parse(value: string) {
  const m = value.match(/^([^0-9]*)(\d+)([^0-9]*)$/);
  if (!m) return null;
  return { pre: m[1], num: parseInt(m[2]), suf: m[3] };
}

export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);
  const parsed = parse(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || !parsed) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(el);

        const duration = 1600;
        const startTime = performance.now();

        function tick(now: number) {
          const p = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setDisplay(`${parsed!.pre}${Math.round(eased * parsed!.num)}${parsed!.suf}`);
          if (p < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
