'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import CustomDatePicker from './CustomDatePicker';

export default function DashboardDateFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState<Date | undefined>(
    searchParams.get('from') ? new Date(searchParams.get('from')!) : undefined
  );
  const [to, setTo] = useState<Date | undefined>(
    searchParams.get('to') ? new Date(searchParams.get('to')!) : undefined
  );

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (from) {
      // Create a local date string YYYY-MM-DD
      const offset = from.getTimezoneOffset()
      const fromDate = new Date(from.getTime() - (offset*60*1000))
      params.set('from', fromDate.toISOString().split('T')[0]);
    } else {
      params.delete('from');
    }

    if (to) {
      const offset = to.getTimezoneOffset()
      const toDate = new Date(to.getTime() - (offset*60*1000))
      params.set('to', toDate.toISOString().split('T')[0]);
    } else {
      params.delete('to');
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [from, to, pathname, router, searchParams]);

  const clearFilters = () => {
    setFrom(undefined);
    setTo(undefined);
    router.push(pathname);
  };

  return (
    <div className="flex flex-col sm:flex-row items-end gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
      <div className="w-full sm:w-auto">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Période (Du)
        </label>
        <div className="w-full sm:w-48 relative z-50">
          <CustomDatePicker
            defaultValue={from}
            onChange={setFrom}
            placeholder="Date de début"
          />
        </div>
      </div>
      
      <div className="w-full sm:w-auto">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Au
        </label>
        <div className="w-full sm:w-48 relative z-40">
          <CustomDatePicker
            defaultValue={to}
            onChange={setTo}
            placeholder="Date de fin"
          />
        </div>
      </div>

      <div className="flex gap-2 w-full sm:w-auto">
        <button
          onClick={applyFilters}
          className="flex-1 sm:flex-none px-4 py-2 bg-brand text-white text-sm font-medium rounded-lg hover:bg-brand-light transition-colors flex items-center justify-center gap-1"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">filter_list</span>
          Filtrer
        </button>
        
        {(from || to) && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center justify-center"
            title="Effacer les filtres"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>
    </div>
  );
}
