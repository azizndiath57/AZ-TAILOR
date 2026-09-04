import React from "react";
import NotificationsDropdown from "@/app/components/NotificationsDropdown";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/(auth)/connexion/actions";
import Navigation from "./Navigation"; // We'll create this
import LogoutButton from "@/app/components/LogoutButton";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col md:flex-row overflow-x-hidden print:min-h-0 print:bg-white">
      {/* Mobile Top App Bar */}
      <header className="md:hidden flex justify-between items-center px-4 py-4 w-full bg-white border-b border-gray-200 sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-2 bg-gray-900 text-[#D4AF37] px-3 py-1.5 rounded-md">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">architecture</span>
          <span className="font-bold tracking-tight text-sm">AZ-TAILOR</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationsDropdown />
          <form action={signout}>
            <button type="submit" className="flex items-center justify-center p-1.5 text-gray-500 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors" title="Se déconnecter">
              <span aria-hidden="true" className="material-symbols-outlined text-[22px]">logout</span>
            </button>
          </form>
        </div>
      </header>

      {/* Desktop Navigation Drawer */}
      <nav className="hidden md:flex flex-col gap-2 py-6 h-screen w-64 fixed left-0 top-0 bg-white border-r border-gray-200 z-40 print:hidden">
        <div className="px-6 mb-8">
          <div className="flex items-center gap-2 bg-gray-900 text-[#D4AF37] px-4 py-2.5 rounded-lg w-full justify-center">
            <span aria-hidden="true" className="material-symbols-outlined text-2xl">architecture</span>
            <h1 className="font-bold text-lg tracking-tight">AZ-TAILOR</h1>
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <Navigation />
        </div>

        {/* Profil atelier et Notifications */}
        <div className="px-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Compte</h4>
            <NotificationsDropdown />
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-700 shrink-0">
              {user?.user_metadata?.first_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sm truncate text-gray-900">
                {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
              </span>
              <span className="text-xs text-gray-500 truncate">{user?.email}</span>
            </div>
          </div>
          <LogoutButton />
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 bg-gray-50 pb-24 md:pb-12 min-h-screen print:ml-0 print:p-0 print:min-h-0 print:bg-white">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      {/* Mobile Bottom Navigation (Handled in Navigation.tsx for pathname) */}
      <Navigation mobile />
    </div>
  );
}
