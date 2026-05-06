"use client";

import Image from "next/image";

type Reference = {
  id: string;
  name: string;
  logoUrl: string;
  website: string | null;
};

export function ReferencesMarquee({ references }: { references: Reference[] }) {
  if (!references.length) return null;

  const doubled = [...references, ...references];

  return (
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
      <div className="flex w-max animate-marquee gap-10">
        {doubled.map((ref, i) => {
          const inner = (
            <div className="flex h-16 w-36 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-white px-5 py-3 shadow-[var(--shadow)] grayscale transition hover:grayscale-0">
              <Image
                src={ref.logoUrl}
                alt={ref.name}
                width={120}
                height={48}
                className="h-auto max-h-10 w-auto max-w-full object-contain"
                unoptimized
              />
            </div>
          );

          return ref.website ? (
            <a key={i} href={ref.website} target="_blank" rel="noreferrer">
              {inner}
            </a>
          ) : (
            <div key={i}>{inner}</div>
          );
        })}
      </div>
    </div>
  );
}
