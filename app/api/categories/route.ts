import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { categorySchema } from "@/lib/validators";

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: "asc" }
  });

  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz kategori verisi." }, { status: 400 });
  }

  const category = await prisma.category.create({
    data: {
      ...parsed.data,
      description: parsed.data.description || null
    }
  });

  revalidatePath("/urunler");
  revalidatePath("/admin/categories");
  return NextResponse.json(category, { status: 201 });
}
