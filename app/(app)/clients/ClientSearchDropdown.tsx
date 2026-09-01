"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/lib/data-access/types";

export default function ClientSearchDropdown({ clients }: { clients: Client[] }) {
  const [clientSearch, setClientSearch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredClients = clients.filter(c => 
    `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <div className="relative max-w-md w-full" ref={dropdownRef}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none">search</span>
      <input
        type="text"
        value={clientSearch}
        onChange={(e) => {
          setClientSearch(e.target.value);
          setIsDropdownOpen(true);
        }}
        onFocus={() => setIsDropdownOpen(true)}
        placeholder="Rechercher un client..."
        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
      />
      
      {isDropdownOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredClients.length > 0 ? (
            filteredClients.map(c => (
              <div 
                key={c.id} 
                className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm border-b border-gray-50 last:border-0"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setClientSearch("");
                  router.push(`/clients/${c.id}`);
                }}
              >
                <div className="font-medium text-gray-900">{c.firstName} {c.lastName}</div>
                <div className="text-xs text-gray-500">{c.phone}</div>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">Aucun client trouvé</div>
          )}
        </div>
      )}
    </div>
  );
}
