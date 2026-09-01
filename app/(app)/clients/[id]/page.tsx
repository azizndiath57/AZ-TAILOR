import Link from "next/link";
import { notFound } from "next/navigation";
import { mockClientsRepository } from "@/lib/data-access";
import ClientActionsDropdown from "../ClientActionsDropdown";
import ClientMeasurementsForm from "./ClientMeasurementsForm";

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

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const client = await mockClientsRepository.getClientById(resolvedParams.id);

  if (!client) {
    notFound();
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/clients" className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
            <span aria-hidden="true" className="material-symbols-outlined text-xl">arrow_back</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
              {client.firstName[0]}{client.lastName[0]}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">{client.firstName} {client.lastName}</h2>
              <p className="text-sm text-gray-500 mt-1">
                Client depuis le {new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(client.createdAt))}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href={`/clients/${client.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">edit</span>
            Modifier le profil
          </Link>
          <div className="p-1 bg-white border border-gray-200 rounded-lg">
            <ClientActionsDropdown clientId={client.id} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column - Measurements (Carnet de Mesures) */}
        <div className="lg:col-span-8">
          <ClientMeasurementsForm clientId={client.id} initialMeasurements={client.measurements} />
        </div>

        {/* Right Column - Info & Orders */}
        <div className="lg:col-span-4 flex flex-col gap-6">

          {/* Infos Client */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Coordonnées</h3>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Téléphone</p>
              <p className="text-sm font-medium text-gray-900">{client.phone}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Adresse</p>
              <p className="text-sm text-gray-700">{client.address || "—"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Notes / Préférences</p>
              <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{client.notes || "Aucune note"}</p>
            </div>
          </div>

          {/* Commandes du client */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col h-full">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-semibold text-gray-900">Commandes ({client.orders?.length || 0})</h3>
              <Link href={`/orders/new?clientId=${client.id}&clientName=${encodeURIComponent(client.firstName + " " + client.lastName)}`} className="text-sm font-medium text-brand hover:underline flex items-center gap-1">
                Nouvelle <span className="material-symbols-outlined text-[16px]">add</span>
              </Link>
            </div>

            <div className="divide-y divide-gray-100">
              {client.orders?.map((order: unknown) => {
                const orderData = order as Record<string, unknown>;
                return (
                <Link
                  key={orderData.id as string}
                  href={`/orders/${orderData.id}/edit`}
                  className="p-4 flex flex-col gap-2 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-brand transition-colors">{orderData.reference as string}</h4>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusColors[orderData.status as string]}`}>
                      {statusLabels[orderData.status as string]}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex flex-col">
                      <span>{orderData.garmentType as string}</span>
                      {(orderData.fabricText || orderData.fabricPhotoUrl) && (
                        <div className="flex items-center gap-2 mt-1">
                          {orderData.fabricPhotoUrl && (
                            <img src={orderData.fabricPhotoUrl as string} alt="Tissu" className="w-6 h-6 rounded object-cover border border-gray-200 shrink-0" />
                          )}
                          {orderData.fabricText && (
                            <span className="text-[10px] opacity-80 line-clamp-1" title={orderData.fabricText as string}>
                              Tissu: {orderData.fabricText as string}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-gray-900">{(orderData.totalPrice as number).toLocaleString("fr-FR")} FCFA</span>
                  </div>
                </Link>
                );
              })}
            </div>
            {(client.orders?.length || 0) > 0 && (
              <div className="p-4 border-t border-gray-100 mt-auto bg-gray-50/50">
                <Link href="/orders" className="text-sm font-medium text-gray-600 hover:text-gray-900 flex justify-center items-center gap-1">
                  Voir tout l&apos;historique <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
