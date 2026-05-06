import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { serviceSchema } from "@/lib/validators";

export async function GET() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json(services);
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (!auth.ok) return auth.response;

  const body = await request.json();
  const parsed = serviceSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz hizmet verisi." }, { status: 400 });
  }

  const service = await prisma.service.create({ data: parsed.data });

  revalidatePath("/");
  revalidatePath("/hizmetler");
  revalidatePath("/admin/services");
  return NextResponse.json(service, { status: 201 });
}
