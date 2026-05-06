import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { productSchema } from "@/lib/validators";

export async function GET() {
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = productSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz ürün verisi." }, { status: 400 });
  }

  const product = await prisma.product.create({
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

  return NextResponse.json(product, { status: 201 });
}
