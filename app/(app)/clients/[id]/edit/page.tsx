import Link from "next/link";
import { notFound } from "next/navigation";
import { mockClientsRepository } from "@/lib/data-access";
import { updateClientAction } from "../../actions";

export default async function EditClientPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const client = await mockClientsRepository.getClientById(resolvedParams.id);

  if (!client) {
    notFound();
  }

  // Bind the client ID to the server action
  const updateClientWithId = updateClientAction.bind(null, client.id);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/clients/${client.id}`} className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
          <span aria-hidden="true" className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">Modifier le Profil</h2>
          <p className="text-sm text-gray-500 mt-1">Mettez à jour les informations de {client.firstName} {client.lastName}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <form action={updateClientWithId}>
          <div className="p-6 md:p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  defaultValue={client.firstName}
                  required 
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  defaultValue={client.lastName}
                  required 
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                <input 
                  type="tel" 
                  id="phone" 
                  name="phone" 
                  defaultValue={client.phone}
                  required 
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                <input 
                  type="text" 
                  id="address" 
                  name="address" 
                  defaultValue={client.address || ""}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes / Préférences</label>
              <textarea 
                id="notes" 
                name="notes" 
                defaultValue={client.notes || ""}
                rows={4}
                placeholder="Ex: Préfère les coupes ajustées..."
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none" 
              />
            </div>

          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <Link 
              href={`/clients/${client.id}`} 
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Annuler
            </Link>
            <button 
              type="submit" 
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-midnight rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
