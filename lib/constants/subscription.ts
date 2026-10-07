// Durée de l'essai gratuit des nouveaux comptes, avant l'abonnement Pro obligatoire
export const TRIAL_DURATION_DAYS = 14;

// Les comptes créés avant cette date gardent la formule gratuite sans limite de durée.
// La formule gratuite n'existe plus pour les comptes créés ensuite (8 octobre 2026, minuit à Dakar).
export const LEGACY_FREE_CUTOFF = "2026-10-08T00:00:00Z";

// Nombre maximum de clients sans abonnement Pro
export const FREE_CLIENT_LIMIT = 20;

// Délai laissé après l'échéance d'un abonnement Pro avant suspension (CGV, article 5)
export const PRO_GRACE_DAYS = 7;

// Prix mensuel de la formule Pro, en FCFA
export const PRO_MONTHLY_PRICE_XOF = 4000;
