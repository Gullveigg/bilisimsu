import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { pageSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = pageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz sayfa verisi." }, { status: 400 });
  }

  const page = await prisma.page.update({ where: { id }, data: parsed.data });

  revalidatePath("/admin/pages");
  revalidatePath("/kurumsal");
  revalidatePath(`/${page.slug}`);
  return NextResponse.json(page);
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });

  if (!page) {
    return NextResponse.json({ error: "Sayfa bulunamadı." }, { status: 404 });
  }

  await prisma.page.delete({ where: { id } });

  revalidatePath("/admin/pages");
  return NextResponse.json({ success: true });
}
