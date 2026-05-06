import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="container-shell flex min-h-[70vh] items-center justify-center py-12">
      <Card className="max-w-xl space-y-4 p-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
          404
        </p>
        <h1 className="text-4xl font-semibold">Aradığınız sayfa bulunamadı</h1>
        <p className="text-[var(--muted)]">
          İçeriğe ulaşmak için ana sayfaya dönebilir veya ürünler sayfasını inceleyebilirsiniz.
        </p>
        <div className="flex justify-center gap-3">
          <Button href="/">Ana Sayfa</Button>
          <Button href="/urunler" variant="secondary">
            Ürünler
          </Button>
        </div>
      </Card>
    </div>
  );
}
