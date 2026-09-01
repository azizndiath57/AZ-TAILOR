"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/orders?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
      <span className="absolute left-3 text-gray-400 material-symbols-outlined text-[18px] pointer-events-none">search</span>
      <input 
        type="text" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher (ex: CMD-0001)..."
        className="pl-9 pr-4 py-2 w-64 bg-gray-50/50 border border-gray-200 hover:border-gray-300 rounded-lg text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all shadow-none"
      />
    </form>
  );
}
