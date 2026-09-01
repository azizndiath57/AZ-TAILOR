"use client";

import { useState, useRef, useEffect } from "react";
import { COUNTRIES } from "@/lib/data/countries";

interface PhoneInputProps {
  name?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

export default function PhoneInput({ name, defaultValue = "", onChange, required }: PhoneInputProps) {
  // Try to parse the default value to separate dial code and number
  let initialCountry = COUNTRIES[0];
  let initialNumber = defaultValue;
  
  if (defaultValue) {
    const matchedCountry = COUNTRIES.find(c => defaultValue.startsWith(c.dialCode));
    if (matchedCountry) {
      initialCountry = matchedCountry;
      initialNumber = defaultValue.slice(matchedCountry.dialCode.length).trim();
    }
  }

  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
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

  const filteredCountries = COUNTRIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.dialCode.includes(searchQuery)
  );

  const fullPhoneNumber = `${selectedCountry.dialCode} ${phoneNumber}`;

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPhoneNumber(val);
    if (onChange) {
      onChange(`${selectedCountry.dialCode} ${val}`);
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {name && <input type="hidden" name={name} value={fullPhoneNumber} required={required} />}
      
      <div className="flex bg-white border border-gray-900 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-brand focus-within:border-brand transition-all">
        {/* Country Selector Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 border-r border-gray-300 hover:bg-gray-100 transition-colors"
        >
          <span className="text-xl leading-none">{selectedCountry.flag}</span>
          <span aria-hidden="true" className="material-symbols-outlined text-[18px] text-gray-500">
            expand_more
          </span>
        </button>

        {/* Phone Number Input */}
        <div className="flex-1 flex items-center">
          <span className="pl-3 text-gray-500 text-sm font-medium select-none">
            {selectedCountry.dialCode}
          </span>
          <input
            type="tel"
            value={phoneNumber}
            onChange={handleNumberChange}
            placeholder="(000) 000-0000"
            className="w-full px-2 py-2.5 bg-transparent text-sm text-gray-900 outline-none"
          />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full md:w-[300px] mt-2 bg-white border border-gray-900 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
              <input 
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-transparent rounded-lg text-sm focus:bg-white focus:border-brand focus:ring-1 focus:ring-brand outline-none transition-all"
              />
            </div>
          </div>
          
          {/* Country List */}
          <div className="max-h-64 overflow-y-auto py-2">
            {filteredCountries.length > 0 ? (
              filteredCountries.map(country => {
                const isSelected = country.code === selectedCountry.code;
                return (
                  <button
                    key={country.code}
                    type="button"
                    onClick={() => {
                      setSelectedCountry(country);
                      setIsOpen(false);
                      setSearchQuery("");
                      if (onChange) onChange(`${country.dialCode} ${phoneNumber}`);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${isSelected ? "bg-orange-50" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{country.flag}</span>
                      <span className={`font-medium ${isSelected ? "text-orange-600" : "text-gray-700"}`}>
                        {country.name}
                      </span>
                    </div>
                    <span className="text-gray-500 font-mono text-xs">{country.dialCode}</span>
                  </button>
                );
              })
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">Aucun pays trouvé</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
