'use client';

import { useLocale, useTranslations } from 'next-intl';
import { setLocale } from '@/app/actions/locale';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const t = useTranslations('Language');
  const locale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = async (newLocale: string) => {
    setIsOpen(false);
    if (newLocale === locale) return;
    await setLocale(newLocale);
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">language</span>
        <span className="uppercase">{locale}</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 bg-white rounded-md shadow-md border border-slate-200 z-50">
          <div className="py-1 min-w-[120px]">
            <button
              onClick={() => handleLanguageChange('fr')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${locale === 'fr' ? 'text-brand font-medium' : 'text-slate-700'}`}
            >
              {t('fr')}
            </button>
            <button
              onClick={() => handleLanguageChange('wo')}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition-colors ${locale === 'wo' ? 'text-brand font-medium' : 'text-slate-700'}`}
            >
              {t('wo')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
