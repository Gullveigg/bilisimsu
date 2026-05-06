import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { WhatsAppTopicPicker } from "@/components/public/whatsapp-topic-picker";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { COMPANY } from "@/lib/constants";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "İletişim",
  description: "Teklif, servis ve ürün bilgisi için Bilişim Su Arıtma ile iletişime geçin.",
  path: "/iletisim",
  keywords: ["su arıtma iletişim", "teklif talebi", "servis talebi"]
});

export default function ContactPage() {
  return (
    <div className="container-shell grid gap-8 py-12 lg:grid-cols-[0.9fr_1.1fr]">
      <div className="space-y-6">
        <SectionTitle
          eyebrow="İletişim"
          title="İhtiyacınıza uygun çözüm için hızlı görüşme planlayın"
          description="Ürün bilgisi, fiyat talebi, servis ve filtre değişimi konularında bizimle iletişime geçin."
        />
        <Card className="space-y-5 p-6">
          <div>
            <p className="text-sm text-[var(--muted)]">Telefon</p>
            <a className="text-2xl font-semibold" href={`tel:${COMPANY.phone}`}>
              {COMPANY.phone}
            </a>
          </div>
          <div>
            <p className="text-sm text-[var(--muted)]">E-posta</p>
            <a className="font-medium" href={`mailto:${COMPANY.email}`}>
              {COMPANY.email}
            </a>
          </div>
          <div>
            <p className="text-sm text-[var(--muted)]">Adres</p>
            <p className="font-medium">{COMPANY.address}</p>
          </div>
          <WhatsAppTopicPicker />
        </Card>
      </div>
      <div className="space-y-6">
        <ContactForm />
        <div className="overflow-hidden rounded-2xl">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3125.9387561623844!2d27.235853699999996!3d38.4197802!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14b9631123043b49%3A0x534000347bef66d8!2sBile%C5%9Fim%20Su%20Ar%C4%B1tma%20Teknolojileri!5e0!3m2!1sen!2str!4v1777372702604!5m2!1sen!2str"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
