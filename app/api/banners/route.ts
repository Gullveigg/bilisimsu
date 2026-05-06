import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { heroSlideSchema } from "@/lib/validators";

export async function GET() {
  const slides = await prisma.heroSlide.findMany({
    orderBy: { order: "asc" }
  });
  return NextResponse.json(slides);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = heroSlideSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz banner verisi." }, { status: 400 });
  }

  const { trust, ...rest } = parsed.data;
  const slide = await prisma.heroSlide.create({
    data: { ...rest, trust: JSON.stringify(trust) }
  });

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return NextResponse.json(slide, { status: 201 });
}
