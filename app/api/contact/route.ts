import { NextResponse } from "next/server";
import { phpContactPost } from "@/lib/php-api";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.name || !body.email || !body.subject || !body.message) {
    return NextResponse.json({ error: "Lütfen tüm zorunlu alanları doğru doldurun." }, { status: 400 });
  }
  const res = await phpContactPost(body);
  return NextResponse.json(await res.json(), { status: res.status });
}
