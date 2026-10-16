"use client";

import { useState } from "react";
import CustomSelect from "@/app/components/CustomSelect";
import {
  MEASUREMENT_GROUPS,
  NUMERIC_MEASUREMENT_FIELDS,
  CLOTHING_SIZES,
  SILHOUETTES,
  EASE_PREFERENCES,
  PROFILE_FIELDS,
  Measurements,
  getMeasurementWarning,
  getMeasurementLabel,
  formatMeasurementValue,
  sortMeasurementEntries,
} from "@/lib/constants/measurement-fields";

function initialWarnings(initial?: Measurements) {
  const warnings: Record<string, string> = {};
  for (const field of NUMERIC_MEASUREMENT_FIELDS) {
    const value = initial?.[field.id];
    if (value === undefined || value === null) continue;
    const warning = getMeasurementWarning(field.id, String(value));
    if (warning) warnings[field.id] = warning;
  }
  return warnings;
}

const toOptions = (values: readonly string[]) => [
  { value: "", label: "Non précisé" },
  ...values.map((v) => ({ value: v, label: v })),
];

/**
 * Champs du carnet de mesures, regroupés dans l'ordre de prise de mesure.
 * `namePrefix` correspond au préfixe attendu par l'action serveur ("measure_" ou "measurement_").
 */
export default function MeasurementFields({
  namePrefix,
  initial,
  onWarningCountChange,
}: {
  namePrefix: string;
  initial?: Measurements;
  onWarningCountChange?: (count: number) => void;
}) {
  const [warnings, setWarnings] = useState<Record<string, string>>(() => initialWarnings(initial));

  const getVal = (key: string) => {
    const v = initial?.[key];
    return v === undefined || v === null ? "" : String(v);
  };

  const handleChange = (id: string, raw: string) => {
    const warning = getMeasurementWarning(id, raw);
    const next = { ...warnings };
    if (warning) next[id] = warning;
    else delete next[id];
    setWarnings(next);
    onWarningCountChange?.(Object.keys(next).length);
  };

  // Ancienne "taille vêtement" numérique : on ne la garde que si elle correspond à une taille de la liste
  const initialSize = CLOTHING_SIZES.includes(getVal("taille_vetement") as (typeof CLOTHING_SIZES)[number])
    ? getVal("taille_vetement")
    : "";

  return (
    <div className="space-y-8">
      {MEASUREMENT_GROUPS.map((group) => (
        <div key={group.id}>
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
            {group.title}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {group.fields.map((field) => {
              const warning = warnings[field.id];
              return (
                <div key={field.id}>
                  <label htmlFor={`${namePrefix}${field.id}`} className="block text-xs font-medium text-gray-500 mb-1">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      id={`${namePrefix}${field.id}`}
                      type="number"
                      step="any"
                      inputMode="decimal"
                      name={`${namePrefix}${field.id}`}
                      defaultValue={getVal(field.id)}
                      onChange={(e) => handleChange(field.id, e.target.value)}
                      aria-invalid={warning ? true : undefined}
                      aria-describedby={warning ? `${namePrefix}${field.id}-warning` : undefined}
                      className={`w-full pl-3 pr-8 py-2 bg-white border rounded-lg text-sm font-medium focus:ring-2 outline-none transition-all ${
                        warning
                          ? "border-orange-400 bg-orange-50 focus:ring-orange-300 focus:border-orange-400"
                          : "border-gray-200 focus:ring-brand focus:border-brand"
                      }`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-medium pointer-events-none">
                      {field.unit}
                    </span>
                  </div>
                  {warning ? (
                    <p id={`${namePrefix}${field.id}-warning`} className="mt-1 text-[11px] leading-tight text-orange-600">
                      {warning}
                    </p>
                  ) : (
                    field.hint && <p className="mt-1 text-[11px] leading-tight text-gray-400">{field.hint}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      <div>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 pb-2 border-b border-gray-100">
          Profil
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{PROFILE_FIELDS.taille_vetement}</label>
            <CustomSelect name={`${namePrefix}taille_vetement`} options={toOptions(CLOTHING_SIZES)} defaultValue={initialSize} placeholder="Non précisé" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{PROFILE_FIELDS.silhouette}</label>
            <CustomSelect name={`${namePrefix}silhouette`} options={toOptions(SILHOUETTES)} defaultValue={getVal("silhouette")} placeholder="Non précisé" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">{PROFILE_FIELDS.aisance}</label>
            <CustomSelect name={`${namePrefix}aisance`} options={toOptions(EASE_PREFERENCES)} defaultValue={getVal("aisance")} placeholder="Non précisé" />
          </div>
          <div className="sm:col-span-3">
            <label htmlFor={`${namePrefix}notes_mesures`} className="block text-xs font-medium text-gray-500 mb-1">
              {PROFILE_FIELDS.notes_mesures}
            </label>
            <textarea
              id={`${namePrefix}notes_mesures`}
              name={`${namePrefix}notes_mesures`}
              rows={3}
              defaultValue={getVal("notes_mesures")}
              placeholder="Ex : épaule droite plus basse, préfère les manches larges…"
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Lecture seule du carnet (formulaires de commande), avec les libellés et unités du carnet
export function MeasurementSummary({ measurements }: { measurements: Measurements }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {sortMeasurementEntries(measurements).map(([key, val]) => (
        <div
          key={key}
          className={`p-3 bg-gray-50 border border-gray-100 rounded-lg ${key === "notes_mesures" ? "col-span-2 md:col-span-4" : ""}`}
        >
          <p className="text-xs text-gray-500 mb-1">{getMeasurementLabel(key)}</p>
          <p className="text-sm font-semibold text-gray-900 whitespace-pre-line">{formatMeasurementValue(key, val)}</p>
        </div>
      ))}
    </div>
  );
}

export function countInitialWarnings(initial?: Measurements) {
  return Object.keys(initialWarnings(initial)).length;
}
