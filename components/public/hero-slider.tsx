"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { ArrowRight, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { buildWhatsappLink, genericWhatsappMessage } from "@/lib/constants";
import { cn } from "@/lib/utils";

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  trust: string[];
  image?: string | null;
  video?: string | null;
};

const STATIC_SLIDES: Slide[] = [
  {
    eyebrow: "Kurumsal Su Teknolojileri",
    title: "Temiz, sağlıklı ve güvenilir su çözümleri",
    description:
      "Bilişim Su Arıtma ile eviniz ve iş yeriniz için kaliteli su arıtma sistemlerine kolayca ulaşın.",
    href: "/urunler",
    cta: "Ürünleri İncele",
    trust: ["Ücretsiz keşif", "Garantili kurulum", "7/24 destek"],
    image: null,
    video: null
  },
  {
    eyebrow: "Ev ve İş Yerleri İçin",
    title: "Profesyonel kurulum, planlı bakım hizmeti",
    description:
      "Cihaz seçiminden kuruluma, filtre değişiminden servise kadar tüm süreçler tek elden yönetilir.",
    href: "/hizmetler",
    cta: "Hizmetleri Gör",
    trust: ["Yerinde kurulum", "Periyodik bakım", "Hızlı servis"],
    image: null,
    video: null
  },
  {
    eyebrow: "Servis ve Bakım",
    title: "Cihazınız sürekli performansta çalışsın",
    description:
      "Periyodik filtre değişimi ve teknik servis ile cihazınızın ömrünü uzatın, su kalitesini koruyun.",
    href: "/servis-filtre-degisimi",
    cta: "Servis Talebi Oluştur",
    trust: ["Planlı takvim", "Orijinal filtreler", "Kayıtlı takip"],
    image: null,
    video: null
  }
];

const INTERVAL = 5000;

function SlideBackground({ slide, index }: { slide: Slide; index: number }) {
  if (slide.video) {
    return (
      <>
        <video
          src={slide.video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[#071428]/65" />
      </>
    );
  }

  if (slide.image) {
    return (
      <>
        <Image
          src={slide.image}
          alt={slide.title}
          fill
          className="object-cover"
          priority={index === 0}
        />
        <div className="absolute inset-0 bg-[#071428]/55" />
      </>
    );
  }

  /* Görsel/video yokken: premium navy→blue degrade */
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-[#071428] via-[#0b2155] to-[#0d5bd7]" />
  );
}

export function HeroSlider({ slides: rawSlides }: { slides?: Slide[] }) {
  const slides = rawSlides && rawSlides.length > 0 ? rawSlides : STATIC_SLIDES;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = useCallback(() => setActive((p) => (p + 1) % slides.length), []);
  const prev = useCallback(
    () => setActive((p) => (p - 1 + slides.length) % slides.length),
    []
  );

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, next, active]);

  return (
    <div
      className="hero-enter relative overflow-hidden"
      style={{ minHeight: "clamp(520px, 80vh, 760px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slayt şeridi */}
      <div
        className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(-${active * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.eyebrow}
            className="relative flex min-w-full items-center"
            style={{ minHeight: "inherit" }}
          >
            {/* Arka plan */}
            <SlideBackground slide={slide} index={index} />

            {/* İçerik — key={active} ile her slide geçişinde stagger yeniden tetiklenir */}
            <div className="container-shell relative z-10 py-28">
              <div key={active} className="slide-content max-w-2xl space-y-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-300">
                  {slide.eyebrow}
                </p>

                <h1 className="text-5xl font-semibold leading-tight tracking-tight text-white lg:text-6xl">
                  {slide.title}
                </h1>

                <p className="max-w-lg text-lg leading-8 text-white/70">
                  {slide.description}
                </p>

                {/* CTA butonları */}
                <div className="flex flex-col gap-3 sm:flex-row">
                  <a
                    href={slide.href}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--primary)] shadow-lg transition hover:bg-blue-50"
                  >
                    {slide.cta}
                    <ArrowRight size={16} />
                  </a>
                  <a
                    href={buildWhatsappLink(genericWhatsappMessage)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/60 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    WhatsApp&apos;tan Teklif Al
                  </a>
                </div>

                {/* Güven göstergeleri */}
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {slide.trust.map((item) => (
                    <span
                      key={item}
                      className="flex items-center gap-2 text-sm text-white/60"
                    >
                      <CheckCircle2 size={14} className="shrink-0 text-blue-300" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alt kontroller */}
      <div className="container-shell absolute bottom-8 left-0 right-0 z-20 flex items-center gap-4">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Slayt ${i + 1}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === active
                  ? "w-8 bg-white"
                  : "w-1.5 bg-white/30 hover:bg-white/60"
              )}
            />
          ))}
        </div>
        <div className="flex gap-1">
          <button
            onClick={prev}
            aria-label="Önceki slayt"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/70 backdrop-blur-sm transition hover:border-white/60 hover:text-white"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={next}
            aria-label="Sonraki slayt"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-white/70 backdrop-blur-sm transition hover:border-white/60 hover:text-white"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* İlerleme çubuğu */}
      {!paused && (
        <div
          key={active}
          className="slider-progress absolute bottom-0 left-0 z-20 h-0.5 bg-white/50"
        />
      )}
    </div>
  );
}
