// Durée de l'essai gratuit des nouveaux comptes, avant l'abonnement Pro obligatoire
export const TRIAL_DURATION_DAYS = 14;

// Les comptes créés avant cette date (8 octobre 2026, minuit à Dakar) s'étaient vu promettre
// 3 mois d'essai : ils les terminent, avec la limite de clients d'origine, avant de passer au Pro.
export const LEGACY_CUTOFF = "2026-10-08T00:00:00Z";
export const LEGACY_TRIAL_DURATION_DAYS = 90;

// Nombre maximum de clients pendant l'essai des comptes créés avant LEGACY_CUTOFF
export const FREE_CLIENT_LIMIT = 20;

// Délai laissé après l'échéance d'un abonnement Pro avant suspension (CGV, article 5)
export const PRO_GRACE_DAYS = 7;

// Prix mensuel de la formule Pro, en FCFA
export const PRO_MONTHLY_PRICE_XOF = 4000;
