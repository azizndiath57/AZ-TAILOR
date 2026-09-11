"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

const navItems = [
  { href: "/dashboard", key: "dashboard", icon: "dashboard" },
  { href: "/orders", key: "orders", icon: "content_cut" },
  { href: "/clients", key: "clients", icon: "groups" },
  { href: "/fittings", key: "fittings", icon: "checkroom" },
  { href: "/settings", key: "settings", icon: "settings" },
];

export default function Navigation({ mobile = false, isAdmin = false }: { mobile?: boolean, isAdmin?: boolean }) {
  const pathname = usePathname();
  const t = useTranslations("Navigation");

  if (mobile) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white border-t border-gray-200 shadow-sm print:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center p-2 rounded ${
                isActive ? "text-brand font-bold" : "text-gray-500"
              }`}
            >
              <span aria-hidden="true" className="material-symbols-outlined text-2xl">{item.icon}</span>
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center p-2 rounded text-red-500`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-2xl">admin_panel_settings</span>
          </Link>
        )}
      </nav>
    );
  }

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-6 py-3 font-medium transition-colors ${
              isActive
                ? "bg-brand-light border-l-4 border-brand text-brand"
                : "border-l-4 border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-xl">{item.icon}</span>
            <span>{t(item.key)}</span>
          </Link>
        );
      })}
      {isAdmin && (
        <Link
          href="/admin"
          className="flex items-center gap-3 px-6 py-3 font-medium transition-colors border-l-4 border-transparent text-red-600 hover:bg-red-50"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-xl">admin_panel_settings</span>
          <span>{t("superAdmin")}</span>
        </Link>
      )}
    </>
  );
}
