export const MEASUREMENT_FIELDS = [
  { id: "poitrine", label: "Poitrine", type: "number" },
  { id: "taille", label: "Taille", type: "number" },
  { id: "hanches", label: "Hanches", type: "number" },
  { id: "carrure", label: "Carrure", type: "number" },
  { id: "largeur_epaules", label: "Largeur épaules", type: "number" },
  { id: "longueur_vetement", label: "Longueur vêtement", type: "number" },
  { id: "longueur_manche", label: "Longueur manche", type: "number" },
  { id: "tour_de_bras", label: "Tour de bras", type: "number" },
  { id: "tour_de_poignet", label: "Tour de poignet", type: "number" },
  { id: "tour_de_cou", label: "Tour de cou", type: "number" },
  { id: "hauteur_poitrine", label: "Hauteur poitrine", type: "number" },
  { id: "tour_de_cuisse", label: "Tour de cuisse", type: "number" },
  { id: "tour_de_genou", label: "Tour de genou", type: "number" },
  { id: "tour_de_mollet", label: "Tour de mollet", type: "number" },
  { id: "tour_de_cheville", label: "Tour de cheville", type: "number" },
  { id: "longueur_pantalon", label: "Longueur pantalon", type: "number" },
  { id: "entrejambe", label: "Entrejambe", type: "number" },
  { id: "fourche_avant", label: "Fourche avant", type: "number" },
  { id: "fourche_arriere", label: "Fourche arrière", type: "number" },
  { id: "longueur_robe", label: "Longueur robe", type: "number" },
  { id: "longueur_jupe", label: "Longueur jupe", type: "number" },
  { id: "hauteur_taille", label: "Hauteur taille", type: "number" },
  { id: "longueur_epaule", label: "Longueur épaule", type: "number" }
] as const;

export type MeasurementFieldId = typeof MEASUREMENT_FIELDS[number]["id"];
