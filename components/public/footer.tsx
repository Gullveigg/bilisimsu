import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import { COMPANY, buildWhatsappLink, genericWhatsappMessage } from "@/lib/constants";
import siteLogo from "@/app/(public)/assets/logo/bilesim_su_aritma_logo_2.png";

const quickLinks = [
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/urunler", label: "Ürünler" },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/servis-filtre-degisimi", label: "Servis & Bakım" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" }
];

export function Footer() {
  return (
    <footer className="mt-24">
      {/* CTA bandı */}
      <div className="bg-[var(--primary)]">
        <div className="container-shell flex flex-col items-center gap-6 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="space-y-1.5">
            <p className="text-xl font-semibold text-white">
              Ücretsiz keşif için bugün bize ulaşın
            </p>
            <p className="text-sm text-blue-200">
              İhtiyacınıza uygun çözümü birlikte belirleyelim.
            </p>
          </div>
          <a
            href={buildWhatsappLink(genericWhatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[var(--primary)] shadow-lg transition hover:bg-blue-50"
          >
            WhatsApp&apos;tan Başlayın
          </a>
        </div>
      </div>

      {/* Ana footer */}
      <div className="bg-[#081a2d] text-white">
        <div className="container-shell grid gap-10 py-16 md:grid-cols-[1.6fr_1fr_1fr]">
          {/* Marka */}
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <Link href="/" className="shrink-0">
                <Image
                  src={siteLogo}
                  alt="Bileşim Su Arıtma"
                  height={72}
                  className="h-18 w-auto object-contain"
                  style={{ mixBlendMode: "screen" }}
                />
              </Link>
              <div>
                <h4 className="mb-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white/50">
                  Hakkımızda
                </h4>
                <p className="text-sm leading-7 text-[#bdd4ea]">
                  Bileşim Su Arıtma, 2018 yılında İzmir&apos;de kurulmuş olup sağlıklı ve güvenilir
                  su çözümleri sunan öncü bir firmadır. Su arıtma ve depolama sistemlerinde yüksek
                  kaliteyi, güçlü teknik destek ile bir araya getirerek sürdürülebilir ve verimli
                  çözümler üretir.
                </p>
              </div>
            </div>
          </div>

          {/* Hızlı erişim */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              Hızlı Erişim
            </h4>
            <div className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#bdd4ea] transition hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* İletişim */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">
              İletişim
            </h4>
            <div className="flex flex-col gap-3.5">
              <a
                href={`tel:${COMPANY.phone}`}
                className="flex items-center gap-3 text-sm text-[#bdd4ea] transition hover:text-white"
              >
                <Phone size={14} className="shrink-0 text-[#7ab8ff]" />
                {COMPANY.phone}
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-3 text-sm text-[#bdd4ea] transition hover:text-white"
              >
                <Mail size={14} className="shrink-0 text-[#7ab8ff]" />
                {COMPANY.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-[#bdd4ea]">
                <MapPin size={14} className="mt-0.5 shrink-0 text-[#7ab8ff]" />
                {COMPANY.address}
              </div>
            </div>
          </div>
        </div>

        {/* Telif hakkı çubuğu */}
        <div className="border-t border-white/10">
          <div className="container-shell flex flex-col items-center gap-2 py-6 text-center text-xs text-[#4a6a84] sm:flex-row sm:justify-between sm:text-left">
            <p>© {new Date().getFullYear()} Bilişim Su Arıtma. Tüm hakları saklıdır.</p>
            <p>Su arıtma sistemleri · Servis · Bakım</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
