import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { categorySchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz kategori verisi." }, { status: 400 });
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...parsed.data,
      description: parsed.data.description || null
    }
  });

  revalidatePath("/urunler");
  revalidatePath("/admin/categories");
  return NextResponse.json(category);
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { products: true } } }
  });

  if (!category) {
    return NextResponse.json({ error: "Kategori bulunamadı." }, { status: 404 });
  }

  if (category._count.products > 0) {
    return NextResponse.json(
      { error: "Bu kategoriye bağlı ürünler var. Önce ürünleri başka kategoriye taşıyın." },
      { status: 409 }
    );
  }

  await prisma.category.delete({ where: { id } });

  revalidatePath("/urunler");
  revalidatePath("/admin/categories");
  return NextResponse.json({ success: true });
}
