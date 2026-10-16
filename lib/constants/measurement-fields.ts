// Carnet de mesures : liste unique utilisée par la fiche client et la création de commande.
// Les clés sont celles stockées dans la colonne JSONB `clients.measurements` : ne pas les renommer
// sans migration, sinon les mesures déjà saisies ne s'affichent plus.

export type MeasurementUnit = "cm" | "m";

export interface NumericMeasurementField {
  id: string;
  label: string;
  hint?: string;
  unit: MeasurementUnit;
  min: number;
  max: number;
}

export interface MeasurementGroup {
  id: string;
  title: string;
  fields: NumericMeasurementField[];
}

// Ordre de prise de mesure : haut, bras, taille et bas, puis longueurs.
// Les bornes sont larges (enfants compris) : elles servent à repérer une faute de frappe, pas à juger la morphologie.
export const MEASUREMENT_GROUPS: MeasurementGroup[] = [
  {
    id: "haut",
    title: "1. Haut du corps",
    fields: [
      { id: "tour_tete", label: "Tour de tête", unit: "cm", min: 40, max: 70 },
      { id: "cou", label: "Tour de cou / encolure", unit: "cm", min: 20, max: 60 },
      { id: "epaule", label: "Épaule", hint: "D'une pointe d'épaule à l'autre", unit: "cm", min: 20, max: 70 },
      { id: "carrure_devant", label: "Carrure devant", unit: "cm", min: 20, max: 65 },
      { id: "carrure_dos", label: "Carrure dos", unit: "cm", min: 20, max: 70 },
      { id: "poitrine", label: "Tour de poitrine", unit: "cm", min: 40, max: 200 },
      { id: "sous_poitrine", label: "Tour sous-poitrine", unit: "cm", min: 40, max: 190 },
      { id: "hauteur_poitrine", label: "Hauteur de poitrine", hint: "Épaule → pointe de poitrine", unit: "cm", min: 10, max: 45 },
      { id: "ecartement_seins", label: "Écartement seins", unit: "cm", min: 8, max: 35 },
    ],
  },
  {
    id: "bras",
    title: "2. Bras",
    fields: [
      { id: "tour_emmanchure", label: "Tour d'emmanchure", unit: "cm", min: 20, max: 75 },
      { id: "tour_bras", label: "Tour de bras (biceps)", hint: "Au plus fort du bras", unit: "cm", min: 15, max: 65 },
      { id: "tour_manche", label: "Tour bas de manche", hint: "À l'ourlet de la manche", unit: "cm", min: 10, max: 60 },
      { id: "tour_poignet", label: "Tour de poignet", unit: "cm", min: 10, max: 30 },
      { id: "longueur_manche", label: "Longueur manche", unit: "cm", min: 20, max: 95 },
      { id: "manche_3_4", label: "Manche 3/4", unit: "cm", min: 15, max: 75 },
      { id: "envergure", label: "Envergure", hint: "Poignet à poignet, bras tendus (grands boubous)", unit: "cm", min: 80, max: 230 },
    ],
  },
  {
    id: "taille_bas",
    title: "3. Taille et bas du corps",
    fields: [
      { id: "ceinture", label: "Tour de taille", unit: "cm", min: 40, max: 200 },
      { id: "tour_ventre", label: "Tour de ventre", unit: "cm", min: 40, max: 220 },
      { id: "tour_hanche", label: "Tour de hanches", unit: "cm", min: 45, max: 220 },
      { id: "bassin", label: "Tour de fesses", hint: "Au point le plus fort", unit: "cm", min: 45, max: 230 },
      { id: "hauteur_taille_fesses", label: "Hauteur taille → fesses", unit: "cm", min: 8, max: 40 },
      { id: "profondeur_cambrure", label: "Profondeur de cambrure", unit: "cm", min: 1, max: 20 },
      { id: "cuisse", label: "Tour de cuisse", unit: "cm", min: 25, max: 110 },
      { id: "genou", label: "Tour de genou", unit: "cm", min: 20, max: 70 },
      { id: "mollet", label: "Tour de mollet", unit: "cm", min: 18, max: 65 },
      { id: "cheville", label: "Bas / cheville", unit: "cm", min: 14, max: 50 },
    ],
  },
  {
    id: "longueurs",
    title: "4. Longueurs",
    fields: [
      { id: "longueur_dos", label: "Longueur dos", hint: "Base du cou → taille", unit: "cm", min: 20, max: 65 },
      { id: "longueur_devant", label: "Longueur devant", hint: "Base du cou → taille, par devant", unit: "cm", min: 20, max: 70 },
      { id: "longueur_taille", label: "Épaule → taille", unit: "cm", min: 20, max: 65 },
      { id: "longueur_haut", label: "Longueur haut", unit: "cm", min: 25, max: 120 },
      { id: "longueur_chemise", label: "Longueur chemise", unit: "cm", min: 30, max: 120 },
      { id: "longueur_robe", label: "Longueur robe", unit: "cm", min: 40, max: 180 },
      { id: "longueur_boubou", label: "Longueur boubou", unit: "cm", min: 50, max: 190 },
      { id: "longueur_jupe", label: "Longueur jupe", unit: "cm", min: 25, max: 130 },
      { id: "longueur_jupe_3_4", label: "Longueur jupe 3/4", unit: "cm", min: 20, max: 120 },
      { id: "longueur_pagne", label: "Longueur pagne", unit: "cm", min: 30, max: 140 },
      { id: "longueur_pantalon", label: "Longueur pantalon", unit: "cm", min: 30, max: 140 },
      { id: "enfourchure", label: "Enfourchure", hint: "Hauteur de montant, taille → entrejambe", unit: "cm", min: 12, max: 50 },
      { id: "entrejambe", label: "Entrejambe", hint: "Entrejambe → cheville", unit: "cm", min: 25, max: 110 },
      { id: "valeur_piece", label: "Valeur de pièce", hint: "Tissu nécessaire, en mètres", unit: "m", min: 0.5, max: 20 },
    ],
  },
];

export const CLOTHING_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"] as const;

export const SILHOUETTES = [
  "Droite (H)",
  "Sablier (X)",
  "Poire (A)",
  "Pomme (O)",
  "Triangle inversé (V)",
] as const;

export const EASE_PREFERENCES = ["Ajusté", "Normal", "Ample"] as const;

// Champs texte du profil (pas des mesures en cm)
export const PROFILE_FIELDS = {
  taille_vetement: "Taille vêtement",
  silhouette: "Type de silhouette",
  aisance: "Préférence d'aisance",
  notes_mesures: "Notes",
} as const;

export const NUMERIC_MEASUREMENT_FIELDS: NumericMeasurementField[] = MEASUREMENT_GROUPS.flatMap((g) => g.fields);

const FIELD_BY_ID = new Map(NUMERIC_MEASUREMENT_FIELDS.map((f) => [f.id, f]));

// Clés déjà présentes en base, saisies avec d'anciennes versions des formulaires
const LEGACY_LABELS: Record<string, string> = {
  volume_poitrine: "Volume poitrine (ancien)",
  manche: "Longueur manche",
  taille: "Tour de taille",
  hanche: "Hanches",
  longueur_totale: "Longueur totale",
};

export type MeasurementValue = number | string;
export type Measurements = Record<string, MeasurementValue>;

export function getMeasurementField(id: string): NumericMeasurementField | undefined {
  return FIELD_BY_ID.get(id);
}

export function getMeasurementLabel(id: string): string {
  return (
    FIELD_BY_ID.get(id)?.label ??
    PROFILE_FIELDS[id as keyof typeof PROFILE_FIELDS] ??
    LEGACY_LABELS[id] ??
    id.replace(/_/g, " ")
  );
}

export function formatMeasurementValue(id: string, value: MeasurementValue): string {
  if (typeof value === "string") return value;
  // L'ancienne "taille vêtement" était enregistrée comme un nombre sans unité
  if (id in PROFILE_FIELDS) return String(value);
  const unit = FIELD_BY_ID.get(id)?.unit ?? "cm";
  return `${value} ${unit}`;
}

// Message d'alerte si la valeur sort des bornes du champ, sinon null
export function getMeasurementWarning(id: string, raw: string): string | null {
  const field = FIELD_BY_ID.get(id);
  if (!field || raw.trim() === "") return null;
  const value = Number(raw.replace(",", "."));
  if (Number.isNaN(value)) return "Nombre invalide";
  if (value < field.min || value > field.max) {
    return `Valeur inhabituelle : attendu entre ${field.min} et ${field.max} ${field.unit}`;
  }
  return null;
}

const PROFILE_CHOICES: Record<string, readonly string[]> = {
  taille_vetement: CLOTHING_SIZES,
  silhouette: SILHOUETTES,
  aisance: EASE_PREFERENCES,
};

/**
 * Lit les champs `${prefix}<clé>` d'un formulaire.
 * Un champ vidé vaut null : la clé est alors retirée du carnet à l'enregistrement.
 * Les bornes min/max ne bloquent pas (le tailleur confirme côté formulaire) ;
 * seules les valeurs absurdes (≤ 0 ou > 300) sont ignorées.
 */
export function parseMeasurementsForm(formData: FormData, prefix: string): Record<string, MeasurementValue | null> {
  const result: Record<string, MeasurementValue | null> = {};
  formData.forEach((raw, key) => {
    if (!key.startsWith(prefix) || typeof raw !== "string") return;
    const id = key.slice(prefix.length);
    const value = raw.trim();

    if (id in PROFILE_FIELDS) {
      if (value === "") result[id] = null;
      else if (id === "notes_mesures") result[id] = value.slice(0, 1000);
      else if (PROFILE_CHOICES[id]?.includes(value)) result[id] = value;
      return;
    }

    if (!FIELD_BY_ID.has(id)) return;
    if (value === "") {
      result[id] = null;
      return;
    }
    const num = Number(value.replace(",", "."));
    if (Number.isFinite(num) && num > 0 && num <= 300) result[id] = num;
  });
  return result;
}

// Fusionne les nouvelles valeurs dans le carnet existant ; null retire la clé
export function mergeMeasurements(
  existing: Measurements | null | undefined,
  updates: Record<string, MeasurementValue | null>
): Measurements {
  const merged: Record<string, MeasurementValue | null> = { ...(existing || {}), ...updates };
  for (const key of Object.keys(merged)) {
    if (merged[key] === null) delete merged[key];
  }
  return merged as Measurements;
}

// Ordre d'affichage : champs connus dans l'ordre du carnet, puis profil, puis anciennes clés
export function sortMeasurementEntries(measurements: Measurements): [string, MeasurementValue][] {
  const order = [...NUMERIC_MEASUREMENT_FIELDS.map((f) => f.id), ...Object.keys(PROFILE_FIELDS)];
  const rank = (k: string) => {
    const i = order.indexOf(k);
    return i === -1 ? order.length : i;
  };
  return Object.entries(measurements)
    .filter(([, v]) => v !== null && v !== "")
    .sort(([a], [b]) => rank(a) - rank(b));
}
