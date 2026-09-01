"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts", icon: "lists" },
  { value: "en_attente", label: "En attente", icon: "pending" },
  { value: "en_cours", label: "En cours", icon: "sync" },
  { value: "pret", label: "Prêtes", icon: "check_circle" },
  { value: "livre", label: "Livrées", icon: "inventory_2" },
  { value: "annule", label: "Annulées", icon: "cancel" },
];

const PAYMENT_OPTIONS = [
  { value: "all", label: "Tous les paiements", icon: "payments" },
  { value: "paid", label: "Payé", icon: "check_circle" },
  { value: "partial", label: "Partiel", icon: "timelapse" },
  { value: "unpaid", label: "Non payé", icon: "error" },
];

function FilterDropdown({ 
  options, 
  value, 
  onChange, 
  placeholder 
}: { 
  options: {value: string, label: string, icon: string}[], 
  value: string, 
  onChange: (val: string) => void,
  placeholder: string
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value) || options[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-900 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand transition-colors"
      >
        <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-gray-500">
          {selectedOption.icon}
        </span>
        {selectedOption.label}
        <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-gray-400 ml-1">
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-white border border-gray-900 rounded-xl shadow-lg z-20 py-1 overflow-hidden">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isSelected 
                    ? "bg-orange-50 text-orange-600 font-medium" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <span aria-hidden="true" className="material-symbols-outlined text-[18px]">
                  {option.icon}
                </span>
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function OrderFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentStatus = searchParams.get("status") || "all";
  const currentPayment = searchParams.get("payment") || "all";

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`/orders?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <FilterDropdown 
        options={STATUS_OPTIONS}
        value={currentStatus}
        onChange={(val) => updateFilters("status", val)}
        placeholder="Statut de la commande"
      />
      <FilterDropdown 
        options={PAYMENT_OPTIONS}
        value={currentPayment}
        onChange={(val) => updateFilters("payment", val)}
        placeholder="Statut du paiement"
      />
    </div>
  );
}
