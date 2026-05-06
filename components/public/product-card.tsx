import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Category, Product } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildProductWhatsappMessage, buildWhatsappLink } from "@/lib/constants";

type ProductWithCategory = Product & { category: Category };

export function ProductCard({ product }: Readonly<{ product: ProductWithCategory }>) {
  return (
    <Card className="overflow-hidden p-4">
      <div className="relative h-56 overflow-hidden rounded-[20px]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition duration-500 hover:scale-105"
        />
      </div>
      <div className="space-y-4 p-3">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
            {product.category.name}
          </span>
          <h3 className="text-xl font-semibold">{product.name}</h3>
          <p className="text-sm leading-6 text-[var(--muted)]">{product.shortDescription}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-semibold text-[var(--foreground)]">
            {product.price || "Teklif Al"}
          </span>
          <div className="flex items-center gap-2">
            {product.whatsappEnabled ? (
              <Button
                href={buildWhatsappLink(buildProductWhatsappMessage(product.name))}
                target="_blank"
                rel="noreferrer"
                variant="ghost"
                className="px-4 py-2"
              >
                WhatsApp
              </Button>
            ) : null}
            <Button href={`/urunler/${product.slug}`} variant="secondary" className="gap-2 px-4 py-2">
              İncele
              <ArrowRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
