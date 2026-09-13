import React from "react";
import NotificationsDropdown from "@/app/components/NotificationsDropdown";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/app/(auth)/connexion/actions";
import Navigation from "./Navigation"; // We'll create this
import SubscriptionGuard from "@/app/components/SubscriptionGuard";
import { getSubscriptionStatus } from "@/app/actions/subscription";
import { getSettingsAction } from "@/app/actions/settings";
import LanguageSwitcher from "@/app/components/LanguageSwitcher";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const subscriptionStatus = await getSubscriptionStatus();
  const settings = await getSettingsAction();

  let isAdmin = false;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role === 'admin') {
      isAdmin = true;
    }
  }

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col md:flex-row overflow-x-hidden print:min-h-0 print:bg-white">
      {/* Mobile Top App Bar */}
      <header className="md:hidden flex justify-between items-center px-4 py-4 w-full bg-white border-b border-gray-200 sticky top-0 z-40 print:hidden">
        <div className="flex items-center gap-2 bg-gray-900 text-[#D4AF37] px-3 py-1.5 rounded-md max-w-[50%]">
          <span aria-hidden="true" className="material-symbols-outlined text-[18px] shrink-0">architecture</span>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold tracking-tight text-sm truncate leading-none">{settings?.workshopName || 'AZ-TAILOR'}</span>
            {settings?.slogan && <span className="text-[9px] uppercase tracking-wider text-[#D4AF37]/70 truncate mt-0.5">{settings.slogan}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
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
          <div className="flex flex-col items-center justify-center text-center bg-gray-900 text-[#D4AF37] px-4 py-3 rounded-lg w-full">
            <div className="flex items-center gap-2 mb-0.5">
              <span aria-hidden="true" className="material-symbols-outlined text-2xl">architecture</span>
              <h1 className="font-bold text-lg tracking-tight">{settings?.workshopName || 'AZ-TAILOR'}</h1>
            </div>
            {settings?.slogan && <span className="text-[10px] uppercase tracking-wider text-[#D4AF37]/70 font-semibold truncate w-full">{settings.slogan}</span>}
          </div>
        </div>

        <div className="flex-1 space-y-1">
          <Navigation isAdmin={isAdmin} />
        </div>

        {/* Profil atelier et Notifications */}
        <div className="px-4 pb-6 mt-auto border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between px-2 mb-2">
            <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Mon Compte</h4>
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <NotificationsDropdown />
            </div>
          </div>
          <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 bg-brand/10 text-brand rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                {settings?.workshopName?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-sm truncate text-gray-900 leading-tight">
                  {settings?.workshopName || "Mon Atelier"}
                </span>
                <span className="text-[11px] text-gray-500 truncate leading-tight">Gérant</span>
              </div>
            </div>
            <form action={signout}>
              <button 
                type="submit" 
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Se déconnecter"
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  logout
                </span>
              </button>
            </form>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 bg-gray-50 pb-24 md:pb-12 min-h-screen print:ml-0 print:p-0 print:min-h-0 print:bg-white">
        <SubscriptionGuard status={subscriptionStatus}>
          {children}
        </SubscriptionGuard>
      </main>

      {/* Mobile Bottom Navigation */}
      {/* Mobile Bottom Navigation (Handled in Navigation.tsx for pathname) */}
      <Navigation mobile isAdmin={isAdmin} />
    </div>
  );
}
