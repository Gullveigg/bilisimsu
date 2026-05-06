"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderKanban,
  Wrench,
  Newspaper,
  FileText,
  Mail,
  Images,
  Building2,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";
import adminLogo from "@/app/(public)/assets/logo/bilesim_su_aritma_logo_2.png";

const links = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/banners", label: "Bannerlar", icon: Images },
  { href: "/admin/products", label: "Ürünler", icon: Package },
  { href: "/admin/categories", label: "Kategoriler", icon: FolderKanban },
  { href: "/admin/services", label: "Hizmetler", icon: Wrench },
  { href: "/admin/blog", label: "Blog", icon: Newspaper },
  { href: "/admin/kurumsal", label: "Kurumsal", icon: Building2 },
  { href: "/admin/references", label: "Referanslar", icon: Star },
  { href: "/admin/pages", label: "Sayfalar", icon: FileText },
  { href: "/admin/messages", label: "Mesajlar", icon: Mail }
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-[28px] border border-[#22314d] bg-[linear-gradient(180deg,#1f2a40_0%,#151f31_100%)] p-5 text-white shadow-[0_24px_60px_rgba(15,23,42,0.28)] lg:sticky lg:top-5 lg:min-h-[calc(100vh-40px)]">
      <div className="mb-6 rounded-[24px] border border-white/10 bg-white/6 p-4">
        <div className="mx-auto max-w-[130px] overflow-hidden">
          <Image
            src={adminLogo}
            alt="Bilişim Su Arıtma Teknolojileri"
            className="h-auto w-full object-contain mix-blend-screen"
            priority
          />
        </div>
        <div className="mt-4 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#87aef7]">
            Yönetim Paneli
          </p>
          <h2 className="mt-1 text-xl font-semibold">Bilişim Su Arıtma</h2>
          <p className="mt-1 text-sm leading-6 text-slate-300">
            İçerik, ürün ve mesaj akışını tek yerden yönetin.
          </p>
        </div>
      </div>
      <nav className="space-y-1.5">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-medium transition",
                isActive
                  ? "border-[#d9e6ff] bg-white text-[#14233b] shadow-[0_16px_30px_rgba(3,10,24,0.24)]"
                  : "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/6 hover:text-white"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl transition",
                  isActive
                    ? "bg-[#edf3ff] text-[var(--primary)]"
                    : "bg-white/8 text-[#93b4ff] group-hover:bg-white/12 group-hover:text-white"
                )}
              >
                <Icon size={18} />
              </span>
              <span className={cn("flex-1", isActive ? "font-semibold text-[#14233b]" : "")}>{label}</span>
              {isActive ? <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" aria-hidden="true" /> : null}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
