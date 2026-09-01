"use client";

import { useState, useRef, useEffect } from "react";

export interface SelectOption {
  value: string;
  label: string;
  icon?: string;
  description?: string;
}

interface CustomSelectProps {
  name?: string;
  options: SelectOption[];
  defaultValue?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

export default function CustomSelect({
  name,
  options,
  defaultValue = "",
  placeholder = "Sélectionner...",
  onChange,
  required
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(defaultValue);
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

  const selectedOption = options.find(opt => opt.value === selectedValue);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {name && <input type="hidden" name={name} value={selectedValue} required={required} />}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-900 rounded-lg text-sm font-medium hover:bg-gray-50 focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
      >
        <div className="flex items-center gap-3">
          {selectedOption?.icon && (
            <span aria-hidden="true" className="material-symbols-outlined text-[20px] text-gray-500">
              {selectedOption.icon}
            </span>
          )}
          <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <span aria-hidden="true" className={`material-symbols-outlined text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 py-2 bg-white border border-gray-900 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              
              return (
                <div
                  key={option.value}
                  onClick={() => {
                    setSelectedValue(option.value);
                    setIsOpen(false);
                    if (onChange) onChange(option.value);
                  }}
                  className={`flex items-center gap-4 mx-2 my-1 px-3 py-3 cursor-pointer rounded-lg transition-colors ${
                    isSelected 
                      ? "bg-orange-100 text-orange-600 font-semibold" 
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                >
                  {option.icon && (
                    <span 
                      aria-hidden="true" 
                      className={`material-symbols-outlined text-[22px] ${isSelected ? "text-orange-500" : "text-gray-500"}`}
                    >
                      {option.icon}
                    </span>
                  )}
                  <div className="flex flex-col">
                    <span className="text-sm">{option.label}</span>
                    {option.description && (
                      <span className={`text-xs ${isSelected ? "text-orange-400" : "text-gray-400"}`}>
                        {option.description}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
