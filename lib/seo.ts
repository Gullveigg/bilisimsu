import type { Metadata } from "next";
import { COMPANY } from "@/lib/constants";

export const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function buildPageMetadata({
  title,
  description,
  path,
  keywords = [],
  image
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  image?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const ogImages = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    keywords: [
      "su arıtma",
      "su arıtma cihazı",
      "filtre değişimi",
      "teknik servis",
      COMPANY.name,
      ...keywords
    ],
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      locale: "tr_TR",
      siteName: COMPANY.name,
      ...(ogImages && { images: ogImages })
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(image && { images: [image] })
    }
  };
}

/* ── JSON-LD schemas ──────────────────────────────────────────────────────── */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: COMPANY.name,
  url: siteUrl,
  email: COMPANY.email,
  telephone: COMPANY.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "İstanbul",
    addressCountry: "TR"
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: COMPANY.phone,
    contactType: "customer service",
    areaServed: "TR",
    availableLanguage: ["tr"]
  }
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: COMPANY.name,
  url: siteUrl,
  email: COMPANY.email,
  telephone: COMPANY.phone,
  address: {
    "@type": "PostalAddress",
    addressLocality: "İstanbul",
    addressCountry: "TR"
  },
  areaServed: { "@type": "Country", "name": "Türkiye" },
  priceRange: "₺₺",
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    opens: "09:00",
    closes: "18:00"
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Su Arıtma Sistemleri ve Hizmetleri"
  }
};

export function buildProductSchema({
  name,
  description,
  image,
  price,
  slug
}: {
  name: string;
  description: string;
  image: string;
  price: string | null;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image,
    url: absoluteUrl(`/urunler/${slug}`),
    brand: { "@type": "Brand", name: COMPANY.name },
    offers: {
      "@type": "Offer",
      priceCurrency: "TRY",
      ...(price ? { price } : { description: "Teklif alınız" }),
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: COMPANY.name }
    }
  };
}

export function buildArticleSchema({
  title,
  excerpt,
  coverImage,
  createdAt,
  slug
}: {
  title: string;
  excerpt: string;
  coverImage: string;
  createdAt: Date;
  slug: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: excerpt,
    image: coverImage,
    url: absoluteUrl(`/blog/${slug}`),
    datePublished: createdAt.toISOString(),
    author: { "@type": "Organization", name: COMPANY.name },
    publisher: { "@type": "Organization", name: COMPANY.name }
  };
}
