"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

export default function Pagination({ totalItems, itemsPerPage = 20 }: { totalItems: number, itemsPerPage?: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between bg-transparent mt-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <Link
          href={createPageUrl(Math.max(1, currentPage - 1))}
          className={`relative inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
        >
          Précédent
        </Link>
        <Link
          href={createPageUrl(Math.min(totalPages, currentPage + 1))}
          className={`relative ml-3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
        >
          Suivant
        </Link>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Affichage de <span className="font-medium text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> à <span className="font-medium text-gray-900">{Math.min(currentPage * itemsPerPage, totalItems)}</span> sur <span className="font-medium text-gray-900">{totalItems}</span> résultats
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-lg shadow-sm" aria-label="Pagination">
            <Link
              href={createPageUrl(Math.max(1, currentPage - 1))}
              className={`relative inline-flex items-center rounded-l-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === 1 ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <span className="sr-only">Précédent</span>
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">chevron_left</span>
            </Link>
            
            {pages.map(page => (
              <Link
                key={page}
                href={createPageUrl(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                  page === currentPage
                    ? 'z-10 bg-brand text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ring-1 ring-inset ring-brand'
                    : 'text-gray-900 ring-1 ring-inset ring-gray-200 hover:bg-gray-50'
                }`}
              >
                {page}
              </Link>
            ))}

            <Link
              href={createPageUrl(Math.min(totalPages, currentPage + 1))}
              className={`relative inline-flex items-center rounded-r-lg px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${currentPage === totalPages ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <span className="sr-only">Suivant</span>
              <span aria-hidden="true" className="material-symbols-outlined text-[20px]">chevron_right</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
