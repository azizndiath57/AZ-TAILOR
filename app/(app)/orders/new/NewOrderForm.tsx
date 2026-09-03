"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { createOrderAction } from "../actions";
import { Client } from "@/lib/data-access/types";
import CustomSelect from "@/app/components/CustomSelect";
import CustomDatePicker from "@/app/components/CustomDatePicker";

export default function NewOrderForm({ clients }: { clients: Client[] }) {
  const searchParams = useSearchParams();
  const initialClientId = searchParams.get("clientId");
  const initialClient = clients.find(c => c.id === initialClientId);
  
  const [clientType, setClientType] = useState<"nouveau" | "existant">(
    initialClientId ? "existant" : "existant"
  );
  const [selectedClientId, setSelectedClientId] = useState<string>(initialClientId || "");
  const [clientSearch, setClientSearch] = useState(initialClient ? `${initialClient.firstName} ${initialClient.lastName} (${initialClient.phone})` : "");
  const [isClientDropdownOpen, setIsClientDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsClientDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const [totalPriceStr, setTotalPriceStr] = useState<string>("0");
  const [totalPaidStr, setTotalPaidStr] = useState<string>("0");
  
  const remainingToPay = Math.max(0, (Number(totalPriceStr) || 0) - (Number(totalPaidStr) || 0));

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showMeasurements, setShowMeasurements] = useState(false);
  const [fabricPhotoName, setFabricPhotoName] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      const result = await createOrderAction(formData);
      
      if (result && result.error) {
        setIsSubmitting(false);
        alert("Une erreur est survenue lors de l'enregistrement de la commande: " + result.error);
        return;
      }
      
      setIsSubmitting(false);
      setShowSuccessAlert(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push('/orders');
      }, 2000);
    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      alert("Une erreur est survenue lors de l'enregistrement de la commande: " + (err.message || "Erreur inconnue"));
    }
  };

  const filteredClients = clients.filter(c => 
    `${c.firstName} ${c.lastName} ${c.phone}`.toLowerCase().includes(clientSearch.toLowerCase())
  );

  return (
    <>
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Main Column - Details */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* Section 1: Client */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Informations Client</h3>
          
          <div className="flex gap-4 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="client_type" 
                value="existant"
                checked={clientType === "existant"} 
                onChange={() => setClientType("existant")}
                className="w-4 h-4 text-brand bg-gray-100 border-gray-300 focus:ring-brand"
              />
              <span className="text-sm font-medium text-gray-700">Client existant</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="client_type" 
                value="nouveau"
                checked={clientType === "nouveau"} 
                onChange={() => setClientType("nouveau")}
                className="w-4 h-4 text-brand bg-gray-100 border-gray-300 focus:ring-brand"
              />
              <span className="text-sm font-medium text-gray-700">Nouveau client</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientType === "existant" ? (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Rechercher un client <span className="text-red-500">*</span></label>
                <div className="relative" ref={dropdownRef}>
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px] pointer-events-none">search</span>
                  <input 
                    type="text"
                    value={clientSearch}
                    onChange={(e) => {
                      setClientSearch(e.target.value);
                      setIsClientDropdownOpen(true);
                      setSelectedClientId(""); // Reset selection if typing
                    }}
                    onFocus={() => setIsClientDropdownOpen(true)}
                    placeholder="Tapez le nom ou numéro..."
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
                  />
                  <input type="hidden" name="clientId" value={selectedClientId} required />
                  
                  {isClientDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredClients.length > 0 ? (
                        filteredClients.map(c => (
                          <div 
                            key={c.id} 
                            className="px-4 py-2 cursor-pointer hover:bg-gray-50 text-sm border-b border-gray-50 last:border-0"
                            onClick={() => {
                              setSelectedClientId(c.id);
                              setClientSearch(`${c.firstName} ${c.lastName} (${c.phone})`);
                              setIsClientDropdownOpen(false);
                            }}
                          >
                            <div className="font-medium text-gray-900">{c.firstName} {c.lastName}</div>
                            <div className="text-xs text-gray-500">{c.phone}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">Aucun client trouvé</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Prénom <span className="text-red-500">*</span></label>
                  <input type="text" name="firstName" autoComplete="off" required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom <span className="text-red-500">*</span></label>
                  <input type="text" name="lastName" autoComplete="off" required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone <span className="text-red-500">*</span></label>
                  <input type="tel" name="phone" autoComplete="off" required className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" />
                </div>
              </>
            )}
          </div>
        </section>

        {/* Section 2: Vêtement */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Détails du Vêtement</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type de vêtement <span className="text-red-500">*</span></label>
              <CustomSelect 
                name="garmentType"
                required
                options={[
                  { value: "costume", label: "Costume", icon: "checkroom" },
                  { value: "chemise", label: "Chemise", icon: "styler" },
                  { value: "pantalon", label: "Pantalon", icon: "accessibility_new" },
                  { value: "boubou", label: "Boubou", icon: "apparel" },
                  { value: "robe", label: "Robe", icon: "woman" }
                ]}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-medium text-gray-700">Tissu fourni</label>
              <CustomSelect 
                options={[
                  { value: "atelier", label: "Tissu de l'atelier", icon: "storefront" },
                  { value: "client", label: "Tissu fourni par le client", icon: "person" }
                ]}
                defaultValue="atelier"
              />
              <label className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer w-full mt-1">
                <span aria-hidden="true" className={`material-symbols-outlined text-[16px] ${fabricPhotoName ? 'text-green-500' : ''}`}>
                  {fabricPhotoName ? 'check_circle' : 'add_a_photo'}
                </span>
                <span className="truncate max-w-[200px]">
                  {fabricPhotoName || 'Photo du tissu (.jpg)'}
                </span>
                <input 
                  type="file" 
                  name="fabricPhoto"
                  accept="image/jpeg, image/jpg, image/png" 
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFabricPhotoName(e.target.files[0].name);
                    } else {
                      setFabricPhotoName(null);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description / Notes de style (Tissu)</label>
            <textarea 
              rows={4}
              name="fabricText"
              placeholder="Détails du tissu, col, boutons, coupe spéciale..."
              className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none"
            ></textarea>
          </div>
        </section>

        {/* Section 3: Mesures */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
            <h3 className="text-lg font-semibold text-gray-900">Mesures</h3>
          </div>
          
          {clientType === "existant" && selectedClientId ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-brand/5 p-4 rounded-lg border border-brand/20">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-brand">straighten</span>
                  <div>
                    <p className="text-sm font-medium text-brand">Mesures récupérées automatiquement</p>
                    <p className="text-xs text-brand/70">Les dernières mesures de ce client ont été appliquées pour cette commande.</p>
                  </div>
                </div>
                <Link href={`/clients/${selectedClientId}`} target="_blank" className="text-xs font-semibold text-brand hover:underline px-3 py-1.5 bg-white rounded-md border border-brand/20">
                  Modifier
                </Link>
              </div>
              
              {clients.find(c => c.id === selectedClientId)?.measurements ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(clients.find(c => c.id === selectedClientId)!.measurements!).map(([key, val]) => (
                    <div key={key} className="p-3 bg-gray-50 border border-gray-100 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1 capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="text-sm font-semibold text-gray-900">{val} cm</p>
                    </div>
                  ))}
                </div>
              ) : (
                 <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-lg text-center border border-gray-100">Aucune mesure enregistrée pour ce client.</div>
              )}
            </div>
          ) : showMeasurements ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in zoom-in-95 duration-200">
              {['cou', 'epaule', 'poitrine', 'manche', 'taille', 'hanche', 'cuisse', 'longueur_totale'].map((m) => (
                <div key={m}>
                  <label className="block text-xs font-medium text-gray-700 mb-1 capitalize">{m.replace('_', ' ')}</label>
                  <input 
                    type="number" 
                    name={`measurement_${m}`} 
                    step="0.5" 
                    placeholder="ex: 45"
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center p-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
              <div className="text-center">
                <span aria-hidden="true" className="material-symbols-outlined text-4xl text-gray-400 mb-2">straighten</span>
                <p className="text-sm text-gray-500 mb-4">Le profil de mesures sera créé ou mis à jour après la validation de la commande.</p>
                <button type="button" onClick={() => setShowMeasurements(true)} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Saisir les mesures maintenant
                </button>
              </div>
            </div>
          )}
        </section>

      </div>

      {/* Sidebar Column - Finances & Deadlines */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        
        {/* Section 4: Tarification */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Tarification</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant Total (FCFA) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                name="totalPrice"
                required
                placeholder="Ex: 50000"
                value={totalPriceStr}
                onChange={(e) => setTotalPriceStr(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Acompte versé (FCFA)</label>
              <input 
                type="number" 
                name="totalPaid"
                placeholder="Ex: 25000"
                value={totalPaidStr}
                onChange={(e) => setTotalPaidStr(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
              />
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Reste à payer</span>
              <span className="text-xl font-bold text-gray-900">{new Intl.NumberFormat('fr-FR').format(remainingToPay)} FCFA</span>
            </div>
          </div>
        </section>

        {/* Section 5: Délais */}
        <section className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">Planification</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'essayage (Fitting)</label>
              <CustomDatePicker name="fittingDate" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de livraison <span className="text-red-500">*</span></label>
              <CustomDatePicker name="expectedDeliveryDate" required />
            </div>
          </div>
        </section>

        {/* Submit Actions */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col gap-3">
          <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-midnight text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center gap-2">
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Enregistrement...
              </>
            ) : (
              "Enregistrer la commande"
            )}
          </button>
          <button type="reset" className="w-full py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
            Annuler
          </button>
        </div>

      </div>
    </form>
    
    {/* Success Alert Modal */}
    {showSuccessAlert && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
            <span aria-hidden="true" className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Commande (Facture) enregistrée !</h3>
          <p className="text-gray-500 text-sm mb-6">La création a été effectuée avec succès. Vous allez être redirigé...</p>
          <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full animate-[progress_2s_ease-in-out]"></div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
