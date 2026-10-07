import { LEGACY_CUTOFF, LEGACY_TRIAL_DURATION_DAYS, PRO_GRACE_DAYS, TRIAL_DURATION_DAYS } from "./constants/subscription";

const DAY_MS = 24 * 60 * 60 * 1000;

export type SubscriptionRow = {
  plan_type: string | null;
  current_period_end: string | null;
  created_at: string;
  stripe_subscription_id?: string | null;
};

export type SubscriptionAccess = {
  // "free" : essai de 3 mois d'un compte créé avant LEGACY_CUTOFF (limité en clients), en cours ou terminé
  // "trial" : essai de 14 jours d'un nouveau compte, en cours ou terminé
  // "pro" : abonnement Pro en cours de validité, ou compte administrateur
  plan: "free" | "trial" | "pro";
  // false : l'application est bloquée jusqu'à l'abonnement
  isActive: boolean;
  isTrialExpired: boolean;
  isSubscriptionExpired: boolean;
  trialDaysLeft: number;
  trialDurationDays: number;
  hasClientLimit: boolean;
  // true : Pro payé par PayTech, à renouveler à la main chaque mois (pas de prélèvement automatique)
  renewsManually: boolean;
  // true : compte administrateur, jamais bloqué et sans abonnement à payer
  isExempt: boolean;
  endDate: string | null;
};

const NO_TRIAL = { isTrialExpired: false, isSubscriptionExpired: false, trialDaysLeft: 0, trialDurationDays: 0 };

// Règle unique d'accès : appelée par l'écran de blocage, les limites de clients et le tableau de bord admin
export function resolveSubscription(
  sub: SubscriptionRow | null | undefined,
  { isAdmin = false, now = new Date() }: { isAdmin?: boolean; now?: Date } = {}
): SubscriptionAccess {
  if (isAdmin) {
    return { plan: "pro", isActive: true, ...NO_TRIAL, hasClientLimit: false, renewsManually: false, isExempt: true, endDate: null };
  }

  // Un compte sans ligne d'abonnement est une anomalie : on ne le bloque pas, mais il reste limité
  if (!sub) {
    return { plan: "free", isActive: true, ...NO_TRIAL, hasClientLimit: true, renewsManually: false, isExempt: false, endDate: null };
  }

  // Seuls les paiements PayTech sont ponctuels (un paiement = un mois) ; un abonnement Stripe
  // est reconduit et son état est tenu à jour par le webhook Stripe.
  const isPayTech = !!sub.stripe_subscription_id?.startsWith("paytech_");
  const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
  const isProLapsed = sub.plan_type === "pro" && isPayTech && !!periodEnd
    && now.getTime() > periodEnd.getTime() + PRO_GRACE_DAYS * DAY_MS;

  if (sub.plan_type === "pro" && !isProLapsed) {
    return { plan: "pro", isActive: true, ...NO_TRIAL, hasClientLimit: false, renewsManually: isPayTech, isExempt: false, endDate: sub.current_period_end };
  }

  const createdAt = new Date(sub.created_at);
  const isLegacy = createdAt < new Date(LEGACY_CUTOFF);
  const trialDurationDays = isLegacy ? LEGACY_TRIAL_DURATION_DAYS : TRIAL_DURATION_DAYS;

  const daysSinceSignup = Math.floor((now.getTime() - createdAt.getTime()) / DAY_MS);
  const trialDaysLeft = Math.max(0, trialDurationDays - daysSinceSignup);
  const isOver = trialDaysLeft === 0;
  // Un compte qui a déjà payé puis arrêté n'est pas « en fin d'essai » : son abonnement est terminé
  const hadSubscription = !!sub.stripe_subscription_id;

  return {
    plan: isLegacy ? "free" : "trial",
    isActive: !isOver,
    isTrialExpired: isOver && !hadSubscription,
    isSubscriptionExpired: isOver && hadSubscription,
    trialDaysLeft,
    trialDurationDays,
    // Les anciens comptes gardent la limite de clients de leur formule d'origine ;
    // le nouvel essai de 14 jours donne accès à la formule Pro complète
    hasClientLimit: isLegacy,
    renewsManually: false,
    isExempt: false,
    endDate: null,
  };
}
