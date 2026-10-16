"use client";

import { useState, useTransition } from "react";
import { saveClientMeasurementsAction } from "../actions";
import { useTranslations } from "next-intl";
import MeasurementFields, { countInitialWarnings } from "@/app/components/MeasurementFields";
import { Measurements } from "@/lib/constants/measurement-fields";

export default function ClientMeasurementsForm({
  clientId,
  initialMeasurements
}: {
  clientId: string,
  initialMeasurements?: Measurements
}) {
  const t = useTranslations("Measurements");
  const [isPending, startTransition] = useTransition();
  const [warningCount, setWarningCount] = useState(() => countInitialWarnings(initialMeasurements));
  // Une mesure hors bornes demande un second clic pour être enregistrée
  const [confirmingWarnings, setConfirmingWarnings] = useState(false);

  // onSubmit plutôt que action : une action de formulaire React vide les champs, même quand on bloque l'envoi
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (warningCount > 0 && !confirmingWarnings) {
      setConfirmingWarnings(true);
      return;
    }
    setConfirmingWarnings(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await saveClientMeasurementsAction(clientId, formData);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-brand text-2xl">straighten</span>
          <h3 className="text-lg font-semibold text-gray-900">{t("title")}</h3>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{t("unit")}</span>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-8">
          <MeasurementFields
            namePrefix="measure_"
            initial={initialMeasurements}
            onWarningCountChange={(count) => {
              setWarningCount(count);
              if (count === 0) setConfirmingWarnings(false);
            }}
          />
        </div>

        {confirmingWarnings && warningCount > 0 && (
          <div role="alert" className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-orange-50 border border-orange-200 text-sm text-orange-800">
            <span aria-hidden="true" className="material-symbols-outlined text-[18px]">warning</span>
            <p>
              {warningCount === 1 ? "1 mesure semble anormale" : `${warningCount} mesures semblent anormales`} (en orange).
              Corrigez-les, ou cliquez à nouveau pour enregistrer quand même.
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-6 py-2.5 bg-midnight text-white font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isPending ? "sync" : "save"}
            </span>
            {isPending ? t("saving") : confirmingWarnings && warningCount > 0 ? "Enregistrer quand même" : t("save")}
          </button>
        </div>
      </form>
    </div>
  );
}
