"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { OrderWithFinancials } from "@/lib/data-access/types";
import Pagination from "@/app/components/Pagination";
import CustomDatePicker from "@/app/components/CustomDatePicker";
import OrderActionsDropdown from "../orders/OrderActionsDropdown";

export default function FittingsClient({ orders }: { orders: OrderWithFinancials[] }) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 20;

  // Keep only active orders that might need a fitting (en_cours or en_attente)
  const allFittingOrders = orders
    .filter(o => o.status === "en_cours" || o.status === "en_attente")
    .filter(o => {
      if (!currentDate) return true;
      const fittingDate = new Date(o.expectedDeliveryDate);
      fittingDate.setDate(fittingDate.getDate() - 2);
      return fittingDate.toDateString() === currentDate.toDateString();
    })
    .sort((a, b) => new Date(a.expectedDeliveryDate).getTime() - new Date(b.expectedDeliveryDate).getTime());

  const paginatedFittings = allFittingOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">Agenda des Essayages</h2>
          <p className="text-sm text-gray-500 mt-1">Planifiez et gérez les rendez-vous d'essayage (Fittings)</p>
        </div>
      </div>

      {/* Fittings Table */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="border-b border-gray-200 p-4 bg-gray-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="w-[300px]">
            <CustomDatePicker 
              placeholder="Filtrer par date d'essayage..."
              onChange={(date) => setCurrentDate(date)}
              defaultValue={currentDate || undefined}
            />
          </div>
          <Link href="/orders/new" className="flex items-center gap-2 px-4 py-2 bg-midnight text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">add</span>
            Nouveau RDV
          </Link>
        </div>
        
        <div className="overflow-x-auto lg:overflow-visible">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Date</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Client</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Détails</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedFittings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    <span aria-hidden="true" className="material-symbols-outlined text-4xl mb-3 text-gray-300 block">event_available</span>
                    Aucun essayage prévu pour le moment.
                  </td>
                </tr>
              ) : (
                paginatedFittings.map(order => {
                  // Mock fitting date (2 days before delivery)
                  const fittingDate = new Date(order.expectedDeliveryDate);
                  fittingDate.setDate(fittingDate.getDate() - 2);

                  return (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg border border-gray-100 bg-white shadow-sm">
                          <span className="text-[10px] font-semibold text-red-500 uppercase leading-none mt-1">
                            {new Intl.DateTimeFormat('fr-FR', { weekday: 'short' }).format(fittingDate).replace('.', '')}
                          </span>
                          <span className="text-lg font-bold text-gray-900 leading-tight">
                            {new Intl.DateTimeFormat('fr-FR', { day: 'numeric' }).format(fittingDate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Link href={`/clients/${order.client.id}`} className="text-sm font-semibold text-gray-900 hover:text-brand transition-colors block">
                          {order.client.firstName} {order.client.lastName}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span>{order.garmentType}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-yellow-50 text-yellow-600">
                            1er Essayage
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">call</span>
                            {order.client.phone}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span aria-hidden="true" className="material-symbols-outlined text-[16px]">sell</span>
                            Réf: {order.reference}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                          <OrderActionsDropdown orderId={order.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {allFittingOrders.length > 20 && (
        <Pagination totalItems={allFittingOrders.length} itemsPerPage={20} />
      )}
    </div>
  );
}
