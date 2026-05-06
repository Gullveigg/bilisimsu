"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPANY, buildWhatsappLink, genericWhatsappMessage } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Page } from "@prisma/client";
import siteLogo from "@/app/(public)/assets/logo/bilesim_su_aritma_logo_2.png";
import { useState, useRef, useCallback } from "react";

const productCategories = [
  {
    group: "Seperatör ve Diskli Filtreleme",
    href: "/urunler?kategori=seperator-ve-diskli-filtreler",
    code: null,
    items: [
      { label: "Diskli Filtre", code: "COMWATECH® DF-1000", href: "/urunler/comwatech-df-1000" },
      { label: "Seperatör Filtre", code: null, href: "/urunler/comwatech-seperator-filtre" },
      { label: "Kum Filtre", code: "COMWATECH® SF-1000", href: "/urunler/comwatech-sf-1000" },
      { label: "Karbon Filtre", code: "COMWATECH® CF-1000", href: "/urunler/comwatech-cf-1000" },
      { label: "Demir ve Mangan Giderimi", code: null, href: "/urunler/comwatech-demir-mangan-giderimi" },
      { label: "Katyonik Reçineli Su Arıtma Sistemleri", code: "COMWATECH® WSS-1000", href: "/urunler/comwatech-wss-1000" },
    ],
  },
  {
    group: "2. Su Saflaştırma Prosesleri",
    href: "/urunler?kategori=su-saflastirma-prosesleri",
    code: null,
    items: [
      { label: "Ters Ozmos", code: "COMWATECH® RO-1000", href: "/urunler/comwatech-ro-1000" },
      { label: "Deiyonizasyon", code: "COMWATECH® MR-1000", href: "/urunler/comwatech-deiyonizasyon-mr-1000" },
      { label: "Elektrodeiyonizasyon-EDI", code: "COMWATECH® MR-1000", href: "/urunler/comwatech-edi-mr-1000" },
      { label: "Mixed Reçineli Sistemleri", code: "COMWATECH® MR-1000", href: "/urunler/comwatech-mixed-recineli-mr-1000" },
    ],
  },
  {
    group: "3. Geri Kazanımlı Üniteleri - Ultra Filtrasyon",
    href: "/urunler/comwatech-uf-1000",
    code: "COMWATECH® UF-1000",
    items: [],
  },
  {
    group: "4. Kimyasal Ekipmanlar",
    href: "/urunler?kategori=kimyasal-ekipmanlar",
    code: null,
    items: [
      { label: "COMWATECH® CWT-1000", code: null, href: "/urunler/comwatech-cwt-1000" },
      { label: "COMWATECH® CWT-A-0127", code: null, href: "/urunler/comwatech-cwt-a-0127" },
      { label: "COMWATECH® CWT-B-0227", code: null, href: "/urunler/comwatech-cwt-b-0227" },
      { label: "COMWATECH® CWT-0918", code: null, href: "/urunler/comwatech-cwt-0918" },
      { label: "COMWATECH® LC-0017", code: null, href: "/urunler/comwatech-lc-0017" },
      { label: "COMWATECH® TP-6000", code: null, href: "/urunler/comwatech-tp-6000" },
      { label: "COMWATECH® TP-7000", code: null, href: "/urunler/comwatech-tp-7000" },
    ],
  },
];

const navigation = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/kurumsal", label: "Kurumsal" },
  { href: "/urunler", label: "Ürünler", dropdown: true },
  { href: "/hizmetler", label: "Hizmetler" },
  { href: "/servis-filtre-degisimi", label: "Servis" },
  { href: "/blog", label: "Blog" },
  { href: "/iletisim", label: "İletişim" }
];

type HeaderProps = {
  pages?: Pick<Page, "slug" | "title">[];
};

export function Header({ pages = [] }: HeaderProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileOpenGroups, setMobileOpenGroups] = useState<Set<string>>(new Set());
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setMobileProductsOpen(false);
    setMobileOpenGroups(new Set());
  }, []);

  const toggleMobileGroup = useCallback((group: string) => {
    setMobileOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });
  }, []);

  const menuItems = [
    ...navigation.slice(0, 2),
    ...pages.map((page) => ({ href: `/${page.slug}`, label: page.title })),
    ...navigation.slice(2)
  ];

  const handleMouseEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setDropdownOpen(false), 150);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white shadow-[0_1px_0_rgba(12,29,48,0.05)]">
      <div className="container-shell flex items-center justify-between gap-6 py-4">
        {/* Logo */}
        <Link className="flex shrink-0 items-center gap-3" href="/">
          <Image
            src={siteLogo}
            alt="Bilişim Su Arıtma"
            height={52}
            priority
            className="h-13 w-auto object-contain"
          />
          <div className="leading-none">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">
              Bileşim
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--foreground)]">
              Su Arıtma
            </p>
          </div>
        </Link>

        {/* Masaüstü navigasyon */}
        <nav className="hidden items-center lg:flex">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            if (item.href === "/urunler" && "dropdown" in item && item.dropdown) {
              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "text-[var(--primary)]"
                        : "text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      size={14}
                      className={cn("transition-transform duration-200", dropdownOpen && "rotate-180")}
                    />
                  </Link>

                  {dropdownOpen && (
                    <div className="absolute left-0 top-full pt-2">
                      <div className="w-80 overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-lg)]">
                        {productCategories.map((group) => {
                          const isOpen = hoveredGroup === group.group;
                          const hasItems = group.items.length > 0;
                          return (
                            <div
                              key={group.group}
                              className="border-b border-[var(--border)] last:border-b-0"
                            >
                              <button
                                onClick={() => hasItems ? setHoveredGroup(isOpen ? null : group.group) : undefined}
                                className="flex w-full items-center justify-between px-4 py-2.5 transition hover:bg-[var(--secondary)]"
                              >
                                <span className="text-sm font-bold text-[var(--foreground)]">{group.group}</span>
                                <span className="flex shrink-0 items-center gap-1.5">
                                  {group.code && (
                                    <span className="text-xs text-[var(--muted)]">{group.code}</span>
                                  )}
                                  {hasItems && (
                                    <ChevronDown
                                      size={13}
                                      className={cn(
                                        "text-[var(--muted)] transition-transform duration-200",
                                        isOpen && "rotate-180"
                                      )}
                                    />
                                  )}
                                </span>
                              </button>
                              {isOpen && hasItems && (
                                <div className="pb-1">
                                  {group.items.map((cat) => (
                                    <Link
                                      key={cat.href}
                                      href={cat.href}
                                      onClick={() => setDropdownOpen(false)}
                                      className="flex items-baseline justify-between px-6 py-1.5 text-sm text-[var(--muted)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                                    >
                                      <span>{cat.label}</span>
                                      {cat.code && (
                                        <span className="ml-2 shrink-0 text-xs text-[var(--muted)]">{cat.code}</span>
                                      )}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                        <div className="border-t border-[var(--border)] p-2">
                          <Link
                            href="/urunler"
                            onClick={() => setDropdownOpen(false)}
                            className="block rounded-lg px-4 py-2 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--secondary)]"
                          >
                            Tüm Ürünleri Gör →
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-[var(--primary)]"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Masaüstü sağ alan */}
        <div className="hidden items-center gap-4 lg:flex">
          <a
            className="flex items-center gap-2 rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            href={`tel:${COMPANY.phone}`}
          >
            <Phone size={14} />
            Hemen Ara
          </a>
          <Button
            href={buildWhatsappLink(genericWhatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5"
          >
            WhatsApp
          </Button>
        </div>

        {/* Mobil menü */}
        <div className="relative lg:hidden">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground)] transition hover:bg-[var(--secondary)]"
            aria-label="Menüyü aç"
          >
            <Menu size={17} />
          </button>

          {mobileMenuOpen && (
            <>
              {/* Overlay — dışarı tıklayınca kapat */}
              <div
                className="fixed inset-0 z-40"
                onClick={closeMobileMenu}
              />
              <div className="absolute right-0 top-11 z-50 max-h-[80vh] w-72 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-2xl border border-[var(--border)] bg-white shadow-[var(--shadow-lg)]">
                <nav className="flex flex-col p-2">
                  {menuItems.map((item) => {
                    if (item.href === "/urunler" && "dropdown" in item && item.dropdown) {
                      return (
                        <div key={item.href}>
                          <button
                            onClick={() => setMobileProductsOpen((v) => !v)}
                            className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                          >
                            {item.label}
                            <ChevronDown
                              size={14}
                              className={cn("ml-2 shrink-0 transition-transform duration-200", mobileProductsOpen && "rotate-180")}
                            />
                          </button>
                          {mobileProductsOpen && (
                            <div className="mb-1 ml-3 border-l border-[var(--border)] pl-3">
                              {productCategories.map((group) => {
                                const isMobileOpen = mobileOpenGroups.has(group.group);
                                const hasItems = group.items.length > 0;
                                return (
                                  <div key={group.group}>
                                    <button
                                      onClick={() => hasItems && toggleMobileGroup(group.group)}
                                      className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-2 transition hover:bg-[var(--secondary)]"
                                    >
                                      <span className="text-left text-xs font-bold leading-snug text-[var(--foreground)]">
                                        {group.group}
                                        {group.code && (
                                          <span className="mt-0.5 block text-[10px] font-normal text-[var(--muted)]">{group.code}</span>
                                        )}
                                      </span>
                                      {hasItems && (
                                        <ChevronDown
                                          size={11}
                                          className={cn(
                                            "shrink-0 text-[var(--muted)] transition-transform duration-200",
                                            isMobileOpen && "rotate-180"
                                          )}
                                        />
                                      )}
                                    </button>
                                    {isMobileOpen && hasItems && (
                                      <div className="ml-2 border-l border-[var(--border)] pl-2">
                                        {group.items.map((cat) => (
                                          <Link
                                            key={cat.href}
                                            href={cat.href}
                                            onClick={closeMobileMenu}
                                            className="block rounded-lg px-2 py-1.5 transition hover:bg-[var(--secondary)]"
                                          >
                                            <span className="block text-xs text-[var(--muted)]">{cat.label}</span>
                                            {cat.code && (
                                              <span className="block text-[10px] text-[var(--muted)] opacity-70">{cat.code}</span>
                                            )}
                                          </Link>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--secondary)] hover:text-[var(--foreground)]"
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
                <div className="border-t border-[var(--border)] p-3">
                  <a
                    className="flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--secondary)]"
                    href={`tel:${COMPANY.phone}`}
                    onClick={closeMobileMenu}
                  >
                    <Phone size={14} />
                    {COMPANY.phone}
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
