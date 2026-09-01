"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: "dashboard" },
  { href: "/orders", label: "Commandes", icon: "content_cut" },
  { href: "/clients", label: "Clients", icon: "groups" },
  { href: "/fittings", label: "Fittings", icon: "checkroom" },
  { href: "/settings", label: "Paramètres", icon: "settings" },
];

export default function Navigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-white border-t border-gray-200 shadow-sm print:hidden">
        {navItems.slice(0, 4).map((item) => {
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
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}
