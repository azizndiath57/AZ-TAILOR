import Link from "next/link";
import { Suspense } from "react";
import NewOrderForm from "./NewOrderForm";
import { mockClientsRepository } from "@/lib/data-access";

export default async function NewOrderPage() {
  const clients = await mockClientsRepository.getClients();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link 
          href="/orders" 
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">Nouvelle Commande</h2>
          <p className="text-sm text-gray-500 mt-1">Créer un nouveau dossier de confection</p>
        </div>
      </div>

      <Suspense fallback={<div className="p-8 text-center text-gray-500">Chargement...</div>}>
        <NewOrderForm clients={clients} />
      </Suspense>
    </div>
  );
}
