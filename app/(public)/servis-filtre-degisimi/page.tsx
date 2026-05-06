import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { ServiceRequestBuilder } from "@/components/public/service-request-builder";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Servis / Filtre Değişimi",
  description: "Planlı filtre değişimi ve teknik servis talepleri için hızlı iletişim ekranı.",
  path: "/servis-filtre-degisimi",
  keywords: ["arıtma servisi", "filtre değişimi", "bakım planı"]
});

export default function ServiceSupportPage() {
  return (
    <div className="container-shell space-y-10 py-12">
      <SectionTitle
        eyebrow="Teknik Servis"
        title="Filtre değişimi ve bakım takibini aksatmadan yönetin"
        description="Su kalitesini ve cihaz ömrünü korumak için düzenli bakım sürecini planlı biçimde ilerletin."
      />
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          "Ön filtre ve membran değişim planı",
          "Yerinde bakım ve performans kontrolü",
          "Kurumsal müşteriler için periyodik servis takvimi"
        ].map((item) => (
          <Card key={item} className="p-6">
            <p className="text-lg font-semibold">{item}</p>
          </Card>
        ))}
      </div>
      <Card className="p-8 lg:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">Servis Talebi</p>
        <h2 className="mt-3 text-3xl font-semibold">Cihazınızı ve talebinizi seçin</h2>
        <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
          Seçimlerinize göre hazırlanan mesaj doğrudan WhatsApp'ta açılır, kısa sürede dönüş yapılır.
        </p>
        <div className="mt-8">
          <ServiceRequestBuilder />
        </div>
      </Card>
    </div>
  );
}
