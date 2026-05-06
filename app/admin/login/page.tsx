import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getSession } from "@/lib/auth";

export default async function AdminLoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/admin/dashboard");
  }

  return (
    <div className="container-shell flex min-h-screen items-center justify-center py-12">
      <LoginForm />
    </div>
  );
}
