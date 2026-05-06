"use client";

import { useState } from "react";
import Image from "next/image";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Ana görsel */}
      <div className="relative h-[420px] overflow-hidden rounded-[26px]">
        <Image
          key={images[active]}
          src={images[active]}
          alt={name}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Yatay kaydırmalı thumbnail şeridi */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-[16px] border-2 transition ${
                active === i
                  ? "border-[var(--primary)] opacity-100"
                  : "border-transparent opacity-60 hover:opacity-90"
              }`}
            >
              <Image src={src} alt={`${name} ${i + 1}`} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
