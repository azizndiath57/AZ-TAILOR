"use client";

import { useTransition } from "react";
import { saveClientMeasurementsAction } from "../actions";

function MeasurementInput({ label, name, defaultValue }: { label: string, name: string, defaultValue: string }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
      <div className="relative">
        <input 
          type="number" 
          step="0.5" 
          name={name}
          defaultValue={defaultValue} 
          className="w-full pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all" 
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none">cm</span>
      </div>
    </div>
  );
}

export default function ClientMeasurementsForm({ 
  clientId, 
  initialMeasurements 
}: { 
  clientId: string, 
  initialMeasurements?: Record<string, number> 
}) {
  const [isPending, startTransition] = useTransition();

  const handleAction = (formData: FormData) => {
    startTransition(async () => {
      await saveClientMeasurementsAction(clientId, formData);
    });
  };

  const getVal = (key: string) => initialMeasurements?.[key]?.toString() || "";

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-brand text-2xl">straighten</span>
          <h3 className="text-lg font-semibold text-gray-900">Carnet de Mesures</h3>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">En cm</span>
      </div>
      
      <form action={handleAction} className="p-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Haut du corps */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Haut du corps</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <MeasurementInput label="Cou / Encolure" name="measure_cou" defaultValue={getVal("cou")} />
              <MeasurementInput label="Épaule" name="measure_epaule" defaultValue={getVal("epaule")} />
              <MeasurementInput label="Poitrine" name="measure_poitrine" defaultValue={getVal("poitrine")} />
              <MeasurementInput label="Longueur Chemise" name="measure_longueur_chemise" defaultValue={getVal("longueur_chemise")} />
              <MeasurementInput label="Longueur Manche" name="measure_longueur_manche" defaultValue={getVal("longueur_manche")} />
              <MeasurementInput label="Tour de Bras" name="measure_tour_bras" defaultValue={getVal("tour_bras")} />
            </div>
          </div>

          {/* Bas du corps */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">Bas du corps</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <MeasurementInput label="Ceinture / Taille" name="measure_ceinture" defaultValue={getVal("ceinture")} />
              <MeasurementInput label="Bassin" name="measure_bassin" defaultValue={getVal("bassin")} />
              <MeasurementInput label="Longueur Pantalon" name="measure_longueur_pantalon" defaultValue={getVal("longueur_pantalon")} />
              <MeasurementInput label="Cuisse" name="measure_cuisse" defaultValue={getVal("cuisse")} />
              <MeasurementInput label="Genou" name="measure_genou" defaultValue={getVal("genou")} />
              <MeasurementInput label="Bas / Cheville" name="measure_cheville" defaultValue={getVal("cheville")} />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-midnight text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPending ? "sync" : "save"}
            </span>
            {isPending ? "Enregistrement..." : "Enregistrer les mesures"}
          </button>
        </div>
      </form>
    </div>
  );
}
