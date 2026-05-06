"use client";

import { useRouter } from "next/navigation";
import { LogOut, PanelTop, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="admin-card flex flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between md:px-7">
      <div className="flex items-start gap-4">
        <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--secondary)] text-[var(--primary)]">
          <PanelTop size={20} />
        </span>
        <div>
          <p className="text-sm font-medium text-[var(--muted)]">Kontrol paneli</p>
          <h1 className="mt-1 text-2xl font-semibold text-[var(--foreground)] md:text-3xl">Yönetim Alanı</h1>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
            <span className="inline-flex items-center gap-2 rounded-full bg-[var(--secondary)] px-3 py-1 text-[var(--primary)]">
              <Sparkles size={14} />
               <a target="_blank" href="https://www.fyomind.com" className="underline">
                Fyomind tarafından geliştirildi.
              </a>
            </span>
          </div>
        </div>
      </div>
      <Button variant="dark" className="gap-2 self-start px-6 py-3 md:self-auto" onClick={handleLogout}>
        <LogOut size={16} />
        Çıkış Yap
      </Button>
    </div>
  );
}
