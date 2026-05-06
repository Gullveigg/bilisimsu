import type { Metadata } from "next";
import "./globals.css";
import { organizationSchema, localBusinessSchema } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: {
    default: "Bilişim Su Arıtma",
    template: "%s | Bilişim Su Arıtma"
  },
  description:
    "Bilişim Su Arıtma ile ev ve iş yerleri için modern su arıtma cihazları, filtre değişimi ve teknik servis çözümleri.",
  keywords: [
    "Bilişim Su Arıtma",
    "su arıtma cihazı",
    "ev tipi su arıtma",
    "iş yeri su arıtma",
    "filtre değişimi",
    "arıtma servisi"
  ],
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "Bilişim Su Arıtma",
    description:
      "Kurumsal su arıtma çözümleri, filtre değişimi, servis ve bakım hizmetleri.",
    type: "website",
    locale: "tr_TR",
    siteName: "Bilişim Su Arıtma",
    url: "/"
  },
  twitter: {
    card: "summary_large_image",
    title: "Bilişim Su Arıtma",
    description:
      "Kurumsal su arıtma çözümleri, filtre değişimi, servis ve bakım hizmetleri."
  },
  robots: {
    index: true,
    follow: true
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
