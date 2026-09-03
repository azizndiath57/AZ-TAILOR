import Link from "next/link";
import { mockClientsRepository } from "@/lib/data-access";
import ClientActionsDropdown from "./ClientActionsDropdown";
import Pagination from "@/app/components/Pagination";
import ClientSearchDropdown from "./ClientSearchDropdown";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedSearchParams = await searchParams;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const itemsPerPage = 20;

  const clients = await mockClientsRepository.getClients();
  
  // Basic mock sorting (most recent first)
  const sortedClients = [...clients].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  
  const paginatedClients = sortedClients.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">Mesures & Clients</h2>
          <p className="text-sm text-gray-500 mt-1">{clients.length} profils enregistrés</p>
        </div>
        <Link
          href="/clients/new"
          className="flex items-center gap-2 px-4 py-2 bg-midnight text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">person_add</span>
          Nouveau Profil
        </Link>
      </div>

      {/* Search */}
      <ClientSearchDropdown clients={clients} />

      {/* Clients Table */}
      <div className="bg-white border border-gray-200 rounded-xl">
        <div className="overflow-x-auto lg:overflow-visible">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Profil</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Téléphone</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Date d&apos;ajout</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide">Commandes</th>
                <th className="px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wide text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    Aucun client enregistré.
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                          {client.firstName[0]}{client.lastName[0]}
                        </div>
                        <Link href={`/clients/${client.id}`} className="text-sm font-semibold text-gray-900 hover:text-brand transition-colors">
                          {client.firstName} {client.lastName}
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {client.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(client.createdAt))}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-50 border border-gray-200 text-xs font-medium text-gray-600">
                        <span aria-hidden="true" className="material-symbols-outlined text-[14px]">content_cut</span>
                        {client.ordersCount} commande{client.ordersCount > 1 ? "s" : ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <ClientActionsDropdown clientId={client.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Pagination */}
      {clients.length > 20 && (
        <Pagination totalItems={clients.length} itemsPerPage={20} />
      )}
    </div>
  );
}
