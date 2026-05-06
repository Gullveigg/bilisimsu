import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { serviceSchema } from "@/lib/validators";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = serviceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz hizmet verisi." }, { status: 400 });
  }

  const service = await prisma.service.update({ where: { id }, data: parsed.data });

  revalidatePath("/");
  revalidatePath("/hizmetler");
  revalidatePath("/admin/services");
  return NextResponse.json(service);
}

export async function DELETE(_request: Request, { params }: Params) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const { id } = await params;
  await prisma.service.delete({ where: { id } });

  revalidatePath("/");
  revalidatePath("/hizmetler");
  revalidatePath("/admin/services");
  return NextResponse.json({ success: true });
}
