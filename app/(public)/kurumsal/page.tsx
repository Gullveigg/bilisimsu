import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { buildServiceWhatsappMessage, buildWhatsappLink } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";
import { parseCorporateContent } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const page = await prisma.page.findFirst({
    where: { slug: "kurumsal", isPublished: true }
  });

  return buildPageMetadata({
    title: page?.title || "Kurumsal",
    description: page?.excerpt || "Bilişim Su Arıtma hakkında kurumsal yaklaşım, hizmet anlayışı ve operasyon modeli.",
    path: "/kurumsal",
    keywords: ["kurumsal su arıtma", "su arıtma firması", "arıtma hizmet anlayışı"]
  });
}

export default async function CorporatePage() {
  const page = await prisma.page.findFirst({
    where: { slug: "kurumsal", isPublished: true }
  });

  const parsed = parseCorporateContent(page?.content || "");
  const heroTitle = "Su arıtma alanında güven veren, sistemli ve modern bir hizmet yaklaşımı";
  const summaryCards = [
    {
      title: "Vizyon",
      text:
        parsed.vision ||
        "Ev ve iş yerleri için su arıtma deneyimini daha güvenli, daha şeffaf ve daha ulaşılabilir hale getirmek."
    },
    {
      title: "Misyon",
      text:
        parsed.mission ||
        "Doğru ürün seçimi, sürdürülebilir teknik servis ve planlı bakım süreçlerini tek yapıda sunmak."
    },
    {
      title: "Yaklaşım",
      text:
        parsed.approach ||
        "Kurumsal dil, temiz tasarım ve hızlı iletişim ile müşterinin karar sürecini kolaylaştırmak."
    }
  ];
  const offerings =
    parsed.offerings.length
      ? parsed.offerings
      : [
          "Önce İnsan",
          "Güven",
          "Liderlik",
          "Sorumluluk"
        ];
  const frameworkText =
    parsed.framework ||
    "Bilişim Su Arıtma yalnızca cihaz satışı değil, keşif, kurulum, bakım ve hızlı iletişimi tek operasyon çizgisinde sunar.";
  const steps =
    parsed.steps.length
      ? parsed.steps
      : [
          { step: "01", title: "İhtiyaç Analizi", text: "Alan tipi ve tüketim yoğunluğu birlikte değerlendirilir." },
          { step: "02", title: "Kurulum Planı", text: "Teklif sonrası uygun ürün ve servis planı netleştirilir." },
          { step: "03", title: "Bakım Takibi", text: "Filtre ve servis süreçleri görünür hale getirilir." }
        ];

  return (
    <div className="container-shell space-y-16 py-12">
      <SectionTitle
        eyebrow="Kurumsal"
        title={heroTitle}
        description={page?.excerpt || "Bilişim Su Arıtma, satış odaklı ama sadece cihaz teslimi ile sınırlı kalmayan bir operasyon modeli kurar."}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {summaryCards.map((item) => (
          <Card key={item.title} className="p-8">
            <h2 className="text-2xl font-semibold">{item.title}</h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.text}</p>
          </Card>
        ))}
      </div>
      <Card className="p-8 lg:p-12">
        <h2 className="text-3xl font-semibold">Değerlerimiz</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {offerings.map((item) => (
            <div key={item} className="rounded-3xl border border-[var(--border)] bg-white p-5">
              <p className="font-medium">{item}</p>
            </div>
          ))}
        </div>
      </Card>
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Güven Çerçevesi
          </p>
          <h2 className="mt-4 text-3xl font-semibold">Saha, ürün ve satış sonrası aynı hatta birleşir</h2>
          <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
            {frameworkText}
          </p>
        </Card>
        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((item) => (
            <Card key={item.step} className="p-6">
              <p className="text-sm font-semibold text-[var(--primary)]">{item.step}</p>
              <h3 className="mt-3 text-xl font-semibold">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>
      <Card className="flex flex-col items-start justify-between gap-6 p-8 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Teklif ve Keşif
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Kurumsal ihtiyaçlar için doğrudan görüşme başlatın</h2>
        </div>
        <Button
          href={buildWhatsappLink(buildServiceWhatsappMessage("kurumsal keşif ve teklif"))}
          target="_blank"
          rel="noreferrer"
        >
          İletişime Geçin
        </Button>
      </Card>
    </div>
  );
}
