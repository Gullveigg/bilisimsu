import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { heroSlideSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = heroSlideSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz banner verisi." }, { status: 400 });
  }

  const { trust, ...rest } = parsed.data;
  const slide = await prisma.heroSlide.update({
    where: { id },
    data: { ...rest, trust: JSON.stringify(trust) }
  });

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return NextResponse.json(slide);
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await prisma.heroSlide.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/banners");
  return NextResponse.json({ success: true });
}
