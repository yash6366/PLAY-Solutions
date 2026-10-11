import { redirect } from "next/navigation";
import { getAdminSession } from "@/server/auth/session";
import { LoginForm } from "./LoginForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const instant = false;

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 relative bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-[#070913] to-[#070913]">
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors bg-slate-900/60 border border-slate-800 rounded-lg px-3 py-1.5 backdrop-blur-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Public Site</span>
        </Link>
      </div>

      <LoginForm />
    </main>
  );
}
