import { Card } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { phpGet, phpAdminGet } from "@/lib/php-api";

type Message = {
  id: string; name: string; email: string; phone?: string;
  subject: string; message: string; createdAt: string;
};

async function getDashboardData() {
  try {
    const [productsRes, categoriesRes, servicesRes, blogRes, messagesRes] = await Promise.all([
      phpGet("products.php"),
      phpGet("categories.php"),
      phpGet("services.php"),
      phpGet("blog.php"),
      phpAdminGet("contact.php"),
    ]);

    const products   = productsRes.ok   ? await productsRes.json()   : [];
    const categories = categoriesRes.ok ? await categoriesRes.json() : [];
    const services   = servicesRes.ok   ? await servicesRes.json()   : [];
    const blog       = blogRes.ok       ? await blogRes.json()       : [];
    const messages   = messagesRes.ok   ? await messagesRes.json()   : [];

    return {
      totalProducts:    products.length,
      activeProducts:   products.filter((p: { isActive: boolean }) => p.isActive).length,
      featuredProducts: products.filter((p: { isFeatured: boolean }) => p.isFeatured).length,
      totalCategories:  categories.length,
      totalServices:    services.length,
      totalBlog:        blog.length,
      totalMessages:    messages.length,
      recentMessages:   (messages as Message[]).slice(0, 5),
    };
  } catch {
    return {
      totalProducts: 0, activeProducts: 0, featuredProducts: 0,
      totalCategories: 0, totalServices: 0, totalBlog: 0,
      totalMessages: 0, recentMessages: [] as Message[],
    };
  }
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Ürün",     value: data.totalProducts   },
          { label: "Kategori", value: data.totalCategories },
          { label: "Hizmet",   value: data.totalServices   },
          { label: "Blog",     value: data.totalBlog       },
          { label: "Mesaj",    value: data.totalMessages   },
        ].map((item) => (
          <Card key={item.label} className="p-6">
            <p className="text-sm text-[var(--muted)]">{item.label}</p>
            <p className="mt-3 text-4xl font-semibold">{item.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-[var(--muted)]">Operasyon Özeti</p>
              <h2 className="mt-2 text-2xl font-semibold">İçerik ve satış hattı durumu</h2>
            </div>
            <Button href="/admin/products/new" className="px-5 py-2.5">
              Yeni Ürün
            </Button>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
              <p className="text-sm text-[var(--muted)]">Aktif ürün</p>
              <p className="mt-2 text-3xl font-semibold">{data.activeProducts}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Yayında olan ürün sayısı</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
              <p className="text-sm text-[var(--muted)]">Öne çıkan ürün</p>
              <p className="mt-2 text-3xl font-semibold">{data.featuredProducts}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Ana sayfada öne çıkan vitrininiz</p>
            </div>
            <div className="rounded-3xl border border-[var(--border)] bg-white p-5">
              <p className="text-sm text-[var(--muted)]">Bekleyen takip</p>
              <p className="mt-2 text-3xl font-semibold">{data.recentMessages.length}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">Son gelen mesajlar inceleme bekliyor</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-[var(--muted)]">Hızlı Eylemler</p>
          <h2 className="mt-2 text-2xl font-semibold">Yönetim kısayolları</h2>
          <div className="mt-6 grid gap-3">
            <Button href="/admin/categories" variant="secondary" className="justify-between rounded-3xl px-5 py-4">
              Kategori düzenle
            </Button>
            <Button href="/admin/services" variant="secondary" className="justify-between rounded-3xl px-5 py-4">
              Hizmetleri güncelle
            </Button>
            <Button href="/admin/messages" variant="secondary" className="justify-between rounded-3xl px-5 py-4">
              Yeni mesajları incele
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[var(--muted)]">Son İletişimler</p>
            <h2 className="mt-2 text-2xl font-semibold">Müşteri mesaj akışı</h2>
          </div>
          <Button href="/admin/messages" variant="ghost" className="px-0">
            Tüm mesajlar
          </Button>
        </div>
        <div className="mt-6 grid gap-4">
          {data.recentMessages.length ? (
            data.recentMessages.map((message) => (
              <div key={message.id} className="rounded-3xl border border-[var(--border)] bg-white p-5">
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="font-semibold">{message.name}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {message.subject} • {message.email}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--muted)]">{formatDate(new Date(message.createdAt))}</p>
                </div>
                <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{message.message}</p>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-dashed border-[var(--border)] bg-white/70 p-5 text-sm text-[var(--muted)]">
              Henüz iletişim mesajı bulunmuyor.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
