import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!product) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz ürün verisi." }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...parsed.data,
      price: parsed.data.price || null,
      imageGallery: JSON.stringify(parsed.data.imageGallery)
    }
  });

  revalidatePath("/");
  revalidatePath("/urunler");
  revalidatePath(`/urunler/${product.slug}`);
  revalidatePath("/admin/products");

  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/urunler");
  revalidatePath(`/urunler/${existing.slug}`);
  revalidatePath("/admin/products");

  return NextResponse.json({ success: true });
}
