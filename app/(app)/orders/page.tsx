import Link from "next/link";
import { OrdersRepository } from "@/lib/data-access";
import OrderActionsDropdown from "./OrderActionsDropdown";
import Pagination from "@/app/components/Pagination";
import OrderFilters from "./OrderFilters";

const statusLabels: Record<string, string> = {
  en_attente: "En attente", en_cours: "En cours", pret: "Prête", livre: "Livrée", annule: "Annulée",
};
const statusColors: Record<string, string> = {
  en_attente: "bg-gray-100 text-gray-700",
  en_cours: "bg-yellow-100 text-yellow-700",
  pret: "bg-blue-100 text-blue-700",
  livre: "bg-green-100 text-green-700",
  annule: "bg-red-100 text-red-700",
};

const paymentStatusLabel = (totalPrice: number, totalPaid: number) => {
  if (totalPaid === 0) return { label: "Non payé", color: "text-red-600 bg-red-50" };
  if (totalPaid >= totalPrice) return { label: "Payé", color: "text-green-600 bg-green-50" };
  return { label: "Partiel", color: "text-yellow-600 bg-yellow-50" };
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const currentStatus = (resolvedSearchParams.status as string) || "all";
  const currentPayment = (resolvedSearchParams.payment as string) || "all";
  const searchQuery = (resolvedSearchParams.q as string) || "";
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const itemsPerPage = 20;
  
  const orders = await OrdersRepository.getOrders();
  
  // Sort orders by most recent first
  const sortedOrders = [...orders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  // Filter by status if needed
  const filteredOrders = currentStatus === "all" 
    ? sortedOrders 
    : sortedOrders.filter(o => o.status === currentStatus);

  // Filter by payment status if needed
  const fullyFilteredOrders = filteredOrders.filter(o => {
    if (currentPayment === "all") return true;
    
    const isUnpaid = o.totalPaid === 0;
    const isPaid = o.totalPaid >= o.totalPrice;
    const isPartial = o.totalPaid > 0 && o.totalPaid < o.totalPrice;

    if (currentPayment === "unpaid") return isUnpaid;
    if (currentPayment === "paid") return isPaid;
    if (currentPayment === "partial") return isPartial;
    
    return true;
  });

  // Filter by search query if needed
  const searchFilteredOrders = fullyFilteredOrders.filter(o => {
    if (!searchQuery) return true;
    const lowerQ = searchQuery.toLowerCase();
    const refMatch = o.reference.toLowerCase().includes(lowerQ);
    const clientNameMatch = o.client ? `${o.client.firstName} ${o.client.lastName}`.toLowerCase().includes(lowerQ) : false;
    return refMatch || clientNameMatch;
  });

  const paginatedOrders = searchFilteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">Commandes</h2>
          <p className="text-sm text-gray-500 mt-1">{searchFilteredOrders.length} commandes {currentStatus !== "all" || currentPayment !== "all" || searchQuery ? "trouvées" : "enregistrées"}</p>
        </div>
        <Link
          href="/orders/new"
          className="flex items-center gap-2 px-4 py-2 bg-midnight text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">add</span>
          Nouvelle Commande
        </Link>
      </div>

      {/* Filters */}
      <OrderFilters />

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="overflow-x-auto lg:overflow-visible">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Référence</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Client</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Type</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Statut</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Paiement</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Livraison</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Aucune commande trouvée pour ce statut.
                  </td>
                </tr>
              )}
              {paginatedOrders.map((order) => {
                const ps = paymentStatusLabel(order.totalPrice, order.totalPaid);
                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/orders/${order.id}/edit`} className="text-sm font-semibold text-brand hover:underline">
                        {order.reference}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.client?.firstName} {order.client?.lastName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{order.garmentType}</div>
                      {(order.fabricText || order.fabricPhotoUrl) && (
                        <div className="flex items-center gap-2 mt-1">
                          {order.fabricPhotoUrl && (
                            <img src={order.fabricPhotoUrl} alt="Tissu" className="w-8 h-8 rounded object-cover border border-gray-200 shrink-0" />
                          )}
                          {order.fabricText && (
                            <div className="text-xs text-gray-500 line-clamp-2" title={order.fabricText}>
                              <span className="font-semibold">Tissu:</span> {order.fabricText}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {statusLabels[order.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 items-start">
                        <div className="text-sm">
                          <span className="font-semibold text-gray-900">{new Intl.NumberFormat('fr-FR').format(order.totalPaid)}</span>
                          <span className="text-gray-500"> / {new Intl.NumberFormat('fr-FR').format(order.totalPrice)}</span>
                        </div>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${ps.color}`}>
                          {ps.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(order.expectedDeliveryDate))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <OrderActionsDropdown orderId={order.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {searchFilteredOrders.length > 20 && (
        <Pagination totalItems={searchFilteredOrders.length} itemsPerPage={20} />
      )}
    </div>
  );
}
