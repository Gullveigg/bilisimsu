import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { phpLogin } from "@/lib/php-api";

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "Geçersiz giriş bilgileri." }, { status: 400 });
  }

  const res = await phpLogin(body.email, body.password);
  if (!res.ok) {
    return NextResponse.json(await res.json(), { status: res.status });
  }

  const user = await res.json();
  const token = await createSessionToken({ userId: user.id, email: user.email });
  await setSessionCookie(token);

  return NextResponse.json({ success: true });
}
