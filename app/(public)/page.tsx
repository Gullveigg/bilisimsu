export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BadgeCheck } from "lucide-react";
import siteLogo from "@/app/(public)/assets/logo/bilesim_su_aritma_logo_2.png";
import type { Prisma, Service, BlogPost } from "@prisma/client";
import { HeroSlider } from "@/components/public/hero-slider";
import { ReferencesMarquee } from "@/components/public/references-marquee";
import { ProductCard } from "@/components/public/product-card";
import { AnimateSection } from "@/components/public/animate-section";
import { CountUp } from "@/components/public/count-up";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { getSiteData } from "@/lib/data";
import { buildPageMetadata } from "@/lib/seo";

type ProductWithCategory = Prisma.ProductGetPayload<{ include: { category: true } }>;

export const metadata: Metadata = buildPageMetadata({
  title: "Anasayfa",
  description:
    "Bilişim Su Arıtma ile ev ve iş yeriniz için kaliteli su arıtma sistemleri, filtre değişimi ve 7/24 teknik servis hizmetleri.",
  path: "/",
  keywords: ["su arıtma sistemleri", "filtre değişimi istanbul", "7/24 teknik servis", "ev tipi su arıtma"]
});

const stats = [
  { value: "500+", label: "Mutlu Müşteri" },
  { value: "10+", label: "Yıl Deneyim" },
  { value: "%98", label: "Memnuniyet Oranı" },
  { value: "7/24", label: "Teknik Destek" }
];

export default async function HomePage() {
  const { featuredProducts, services, blogPosts, slides, references } = await getSiteData();

  return (
    <div className="pb-32">

      {/* ── Hero Slider ─────────────────────────────────────────────────────── */}
      <section>
        <HeroSlider slides={slides} />
      </section>

      {/* ── İstatistikler ───────────────────────────────────────────────────── */}
      <section className="container-shell mt-24">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimateSection
              key={stat.label}
              animation="fade-up"
              delay={([0, 100, 200, 300] as const)[i]}
            >
              <div className="rounded-2xl border border-[var(--border)] bg-white px-6 py-7 text-center shadow-[var(--shadow)]">
                <CountUp
                  value={stat.value}
                  className="text-3xl font-bold text-[var(--primary)] sm:text-4xl"
                />
                <p className="mt-2 text-sm font-medium text-[var(--muted)]">{stat.label}</p>
              </div>
            </AnimateSection>
          ))}
        </div>
      </section>

      {/* ── Hakkımızda ──────────────────────────────────────────────────────── */}
      <section className="container-shell mt-36">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          {/* Sol: metin */}
          <AnimateSection animation="slide-left">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                Hakkımızda
              </p>
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
                Su arıtmada güvenilir çözüm ortağınız
              </h2>
              <p className="text-base leading-8 text-[var(--muted)]">
                Bileşim Su Arıtma olarak 10 yılı aşkın deneyimimizle ev ve iş yerlerine yönelik
                kaliteli su arıtma sistemleri sunuyoruz. Müşterilerimize sadece ürün satmıyor;
                kurulum, bakım ve teknik servis süreçlerini de eksiksiz yönetiyoruz.
              </p>
              <p className="text-base leading-8 text-[var(--muted)]">
                Teknoloji firması disipliniyle hareket eden yapımız sayesinde her müşterimize
                ihtiyacına özel çözümler üretir, satış sonrası süreci de aynı titizlikle takip ederiz.
              </p>
              <div className="space-y-3 pt-2">
                {[
                  "Keşiften kuruluma profesyonel süreç yönetimi",
                  "Orijinal filtre ve yedek parça garantisi",
                  "Planlı bakım takvimiyle cihaz ömrü uzatma",
                  "Hızlı teknik servis ve 7/24 müşteri desteği"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <BadgeCheck size={18} className="mt-0.5 shrink-0 text-[var(--primary)]" />
                    <p className="text-sm leading-6 text-[var(--muted)]">{item}</p>
                  </div>
                ))}
              </div>
              <div className="pt-2">
                <Link
                  href="/kurumsal"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:gap-3"
                >
                  Kurumsal sayfamızı ziyaret edin
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </AnimateSection>

          {/* Sağ: logo */}
          <AnimateSection animation="slide-right">
            <div className="flex items-center justify-center">
              <Image
                src={siteLogo}
                alt="Bileşim Su Arıtma Teknolojileri"
                className="w-full max-w-xs"
                priority
              />
            </div>
          </AnimateSection>
        </div>
      </section>

      {/* ── Referanslar ─────────────────────────────────────────────────────── */}
      {references.length > 0 && (
        <section className="container-shell mt-20">
          <AnimateSection animation="fade-up">
            <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Referanslarımız
            </p>
            <ReferencesMarquee references={references} />
          </AnimateSection>
        </section>
      )}
         <br>
         </br>
      {/* ── Sertifikalar ────────────────────────────────────────────────────── */}
      <section className="container-shell mt-20">
        <AnimateSection animation="fade-up">
          <div className="rounded-2xl border border-[var(--border)] bg-white px-8 py-8 shadow-[var(--shadow)]">
            <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
              Sertifikalar ve Standartlar
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { code: "ISO 9001", name: "Kalite Yönetim Sistemi" },
                { code: "ISO 14001", name: "Çevre Yönetim Sistemi" },
                { code: "CE", name: "Avrupa Uygunluk" },
                { code: "NSF / ANSI", name: "Su Arıtma Standardı" },
                { code: "TSE", name: "Türk Standartları" }
              ].map((cert, i) => (
                <AnimateSection
                  key={cert.code}
                  animation="scale-in"
                  delay={([0, 100, 200, 300, 400] as const)[i]}
                >
                  <div className="flex min-w-[120px] flex-col items-center gap-1.5 rounded-xl border border-[var(--border)] bg-white px-5 py-4 text-center transition hover:border-[var(--primary)]/30 hover:shadow-sm">
                    <p className="text-sm font-bold tracking-wide text-[var(--foreground)]">
                      {cert.code}
                    </p>
                    <p className="text-[11px] leading-4 text-[var(--muted)]">{cert.name}</p>
                  </div>
                </AnimateSection>
              ))}
            </div>
          </div>
        </AnimateSection>
      </section>

      {/* ── Öne Çıkan Ürünler ───────────────────────────────────────────────── */}
      <br></br>
      <section className="container-shell mt-36">
        <AnimateSection animation="fade-up">
          <SectionTitle
            eyebrow="Öne Çıkan Ürünler"
            title="Yüksek performanslı arıtma sistemleri"
            description="Ev ve işletme kullanımına uygun ürünleri teknik destek ve hızlı teklif süreci ile sunuyoruz."
          />
        </AnimateSection>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {featuredProducts.map((product: ProductWithCategory, i: number) => (
            <AnimateSection
              key={product.id}
              animation="fade-up"
              delay={([0, 100, 200] as const)[i] ?? 0}
            >
              <ProductCard product={product} />
            </AnimateSection>
          ))}
        </div>
      </section>

      {/* ── Hizmetler ───────────────────────────────────────────────────────── */}
      <br></br>
      <section className="container-shell mt-36">
        <AnimateSection animation="fade-up">
          <SectionTitle
            eyebrow="Hizmetler"
            title="Kurulumdan bakıma tüm süreç tek çatı altında"
            description="Cihazların uzun ömürlü ve verimli çalışması için satış sonrası süreci de önemseyen bir hizmet yapısı."
          />
        </AnimateSection>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {services.map((service: Service, i: number) => (
            <AnimateSection
              key={service.id}
              animation="fade-up"
              delay={([0, 100, 200] as const)[i] ?? 0}
            >
              <Card className="flex flex-col p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                  0{i + 1}
                </p>
                <h3 className="mt-4 text-xl font-semibold text-[var(--foreground)]">
                  {service.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[var(--muted)]">
                  {service.description}
                </p>
                <Link
                  href="/hizmetler"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:gap-3"
                >
                  Detaylar
                  <ArrowRight size={14} />
                </Link>
              </Card>
            </AnimateSection>
          ))}
        </div>
      </section>

      {/* ── Servis CTA ──────────────────────────────────────────────────────── */}
      <br></br>
      <section className="container-shell mt-24">
        <AnimateSection animation="scale-in">
          <div className="flex flex-col gap-8 overflow-hidden rounded-[var(--radius)] bg-[var(--primary)] px-10 py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14">
            <div className="max-w-xl space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">
                Servis ve Filtre Değişimi
              </p>
              <h2 className="text-2xl font-semibold leading-snug text-white sm:text-3xl">
                Düzenli bakımla cihaz performansını koruyun
              </h2>
              <p className="text-base leading-7 text-blue-100">
                Filtre değişimi ve teknik servis süreçlerini takvime bağlı şekilde yönetin.
              </p>
            </div>
            <a
              href="/servis-filtre-degisimi"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-[var(--primary)] shadow-lg transition hover:bg-blue-50"
            >
              Servis Talebi Oluştur
              <ArrowRight size={15} />
            </a>
          </div>
        </AnimateSection>
      </section>

      {/* ── Blog ────────────────────────────────────────────────────────────── */}
      <br></br>
      <section className="container-shell mt-36">
        <AnimateSection animation="fade-up">
          <SectionTitle
            eyebrow="Blog"
            title="Doğru ürün ve bakım kararları için faydalı bilgiler"
          />
        </AnimateSection>
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {blogPosts.map((post: BlogPost, i: number) => (
            <AnimateSection
              key={post.id}
              animation="fade-up"
              delay={([0, 100, 200] as const)[i] ?? 0}
            >
              <Card className="flex flex-col p-8">
                <div className="mb-6 h-px w-10 bg-[var(--primary)]" />
                <p className="text-xs font-medium text-[var(--muted)]">
                  {new Date(post.createdAt).toLocaleDateString("tr-TR", {
                    year: "numeric",
                    month: "long"
                  })}
                </p>
                <h3 className="mt-3 text-lg font-semibold leading-snug text-[var(--foreground)]">
                  {post.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-7 text-[var(--muted)]">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--primary)] transition hover:gap-3"
                >
                  Devamını oku
                  <ArrowRight size={14} />
                </Link>
              </Card>
            </AnimateSection>
          ))}
        </div>
      </section>

    </div>
  );
}
