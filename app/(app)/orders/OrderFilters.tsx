"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";

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
  const t = useTranslations("Orders");
  const tDash = useTranslations("Dashboard");
  
  const currentStatus = searchParams.get("status") || "all";
  const currentPayment = searchParams.get("payment") || "all";
  const currentSearch = searchParams.get("q") || "";

  const STATUS_OPTIONS = [
    { value: "all", label: t("status"), icon: "lists" },
    { value: "en_attente", label: tDash("waiting"), icon: "pending" },
    { value: "en_cours", label: tDash("inProgress"), icon: "sync" },
    { value: "pret", label: tDash("ready"), icon: "check_circle" },
    { value: "livre", label: tDash("delivered"), icon: "inventory_2" },
    { value: "annule", label: t("canceled"), icon: "cancel" },
  ];

  const PAYMENT_OPTIONS = [
    { value: "all", label: t("payment"), icon: "payments" },
    { value: "paid", label: t("paid"), icon: "check_circle" },
    { value: "partial", label: t("partial"), icon: "timelapse" },
    { value: "unpaid", label: t("unpaid"), icon: "error" },
  ];

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`/orders?${params.toString()}`);
  };

  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = (val: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      updateFilters("q", val);
    }, 300);
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3">
      <div className="relative w-full sm:w-64 shrink-0">
        <span aria-hidden="true" className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
          search
        </span>
        <input
          type="text"
          placeholder={t("search")}
          defaultValue={currentSearch}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-900 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand transition-colors"
        />
      </div>
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
