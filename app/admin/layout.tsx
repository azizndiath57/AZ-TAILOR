import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import LogoutButton from "@/app/components/LogoutButton";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion");
  }

  // Check if the user is an admin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== 'admin') {
    // If not admin, send them back to the normal dashboard
    redirect("/dashboard");
  }

  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      {/* Mobile Top App Bar */}
      <header className="md:hidden flex justify-between items-center px-4 py-4 w-full bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-md">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-brand">admin_panel_settings</span>
          <span className="font-bold tracking-tight text-sm uppercase">AZ-TAILOR ADMIN</span>
        </div>
      </header>

      {/* Desktop Navigation Drawer */}
      <nav className="hidden md:flex flex-col gap-2 py-6 h-screen w-64 fixed left-0 top-0 bg-slate-900 text-slate-300 border-r border-slate-800 z-40">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2 bg-slate-800 text-brand px-4 py-3 rounded-lg w-full justify-center shadow-inner">
            <span aria-hidden="true" className="material-symbols-outlined text-2xl">admin_panel_settings</span>
            <h1 className="font-bold text-lg tracking-tight uppercase">Super Admin</h1>
          </div>
        </div>

        <div className="flex-1 space-y-1 px-4">
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 text-white font-medium transition-colors">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Tableau de bord
          </Link>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">storefront</span>
            Retour à l'Atelier
          </Link>
        </div>

        {/* Profil admin */}
        <div className="px-6 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-brand rounded-full flex items-center justify-center font-bold text-white shrink-0">
              A
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate text-white">
                Administrateur
              </span>
              <span className="text-xs text-slate-400 truncate">{user.phone || 'Admin'}</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 bg-gray-100 min-h-screen">
        {children}
      </main>
    </div>
  );
}
