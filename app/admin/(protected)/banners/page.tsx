import { BannerManager } from "@/components/admin/banner-manager";
import { prisma } from "@/lib/prisma";

export default async function AdminBannersPage() {
  const slides = await prisma.heroSlide.findMany({ orderBy: { order: "asc" } });
  return <BannerManager slides={slides} />;
}
