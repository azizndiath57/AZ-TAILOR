"use client";

import Link from "next/link";
import { createClientAction } from "../actions";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewClientPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [showLimitModal, setShowLimitModal] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    const result = await createClientAction(formData);
    
    if (result?.error === "LIMIT_REACHED") {
      setShowLimitModal(true);
    } else if (result?.error) {
      setError(result.error);
    } else if (result?.success) {
      router.push(`/clients/${result.clientId}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Modal Freemium */}
      {showLimitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 overflow-hidden text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-brand/10 mb-4">
              <span className="material-symbols-outlined text-brand text-2xl">workspace_premium</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Limite Atteinte</h3>
            <p className="text-gray-500 mb-6 text-sm">
              Vous avez atteint la limite de 20 clients pour le plan gratuit. Passez au plan Pro pour ajouter des clients en illimité et développer votre activité.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowLimitModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">
                Annuler
              </button>
              <Link href="/settings?tab=abonnement" className="flex-1 px-4 py-2 bg-brand text-white font-medium rounded-lg hover:bg-brand/90 transition-colors">
                Passer au Pro
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/clients" className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors">
          <span aria-hidden="true" className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">Nouveau Profil</h2>
          <p className="text-sm text-gray-500 mt-1">Ajoutez un client et ses informations de contact</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <form action={handleSubmit}>
          <div className="p-6 md:p-8 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
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
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Notes / Préférences</label>
              <textarea 
                id="notes" 
                name="notes" 
                rows={4}
                placeholder="Ex: Préfère les coupes ajustées..."
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none" 
              />
            </div>

          </div>

          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
            <Link 
              href="/clients" 
              className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Annuler
            </Link>
            <button 
              type="submit" 
              className="px-6 py-2.5 text-sm font-medium text-white bg-midnight rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
            >
              Créer le profil
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
