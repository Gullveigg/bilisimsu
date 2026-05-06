import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { buildServiceWhatsappMessage, buildWhatsappLink } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildPageMetadata({
  title: "Hizmetler",
  description: "Kurulum, servis, bakım ve filtre değişimi hizmetlerini inceleyin.",
  path: "/hizmetler",
  keywords: ["kurulum hizmeti", "periyodik bakım", "filtre değişimi"]
});

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { createdAt: "asc" } });

  return (
    <div className="container-shell space-y-10 py-12">
      <SectionTitle
        eyebrow="Hizmetler"
        title="Kurulumdan periyodik bakıma uzanan destek modeli"
        description="Satış sonrası memnuniyeti görünür kılan operasyonel hizmetler."
      />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <Card key={service.id} className="flex flex-col p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              {service.slug.replace(/-/g, " ")}
            </p>
            <h2 className="mt-4 text-2xl font-semibold">{service.title}</h2>
            <p className="mt-4 flex-1 text-sm leading-7 text-[var(--muted)]">{service.description}</p>
            <a
              href={buildWhatsappLink(buildServiceWhatsappMessage(service.title))}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition hover:border-[#25D366] hover:text-[#25D366]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 shrink-0"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.878-1.426A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.946 7.946 0 01-4.073-1.115l-.292-.174-3.024.884.844-3.098-.19-.317A7.955 7.955 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg>
              Bu hizmet için yaz
            </a>
          </Card>
        ))}
      </div>
      <Card className="flex flex-col items-start justify-between gap-6 p-8 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            Hizmet Talebi
          </p>
          <h2 className="mt-3 text-3xl font-semibold">Kurulum ve bakım sürecini WhatsApp üzerinden başlatın</h2>
        </div>
        <Button
          href={buildWhatsappLink(buildServiceWhatsappMessage("kurulum, bakım ve filtre değişimi"))}
          target="_blank"
          rel="noreferrer"
        >
          Hizmet Talebi Gönder
        </Button>
      </Card>
    </div>
  );
}
