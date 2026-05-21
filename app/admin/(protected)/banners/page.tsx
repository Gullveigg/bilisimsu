import { BannerManager } from "@/components/admin/banner-manager";
import { phpGet } from "@/lib/php-api";

export default async function AdminBannersPage() {
  let slides: unknown[] = [];
  try {
    const res = await phpGet("banners.php");
    if (res.ok) slides = await res.json();
  } catch { /* backend erişilemez */ }
  return <BannerManager slides={slides as Parameters<typeof BannerManager>[0]["slides"]} />;
}
