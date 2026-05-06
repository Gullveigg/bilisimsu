import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { referenceSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = referenceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz referans verisi." }, { status: 400 });
  }

  const reference = await prisma.reference.update({ where: { id }, data: parsed.data });

  revalidatePath("/");
  revalidatePath("/admin/references");
  return NextResponse.json(reference);
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await prisma.reference.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/admin/references");
  return NextResponse.json({ success: true });
}
