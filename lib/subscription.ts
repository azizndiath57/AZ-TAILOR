import { LEGACY_FREE_CUTOFF, PRO_GRACE_DAYS, TRIAL_DURATION_DAYS } from "./constants/subscription";

const DAY_MS = 24 * 60 * 60 * 1000;

export type SubscriptionRow = {
  plan_type: string | null;
  current_period_end: string | null;
  created_at: string;
  stripe_subscription_id?: string | null;
};

export type SubscriptionAccess = {
  // "free" : formule gratuite conservée par les comptes historiques
  // "trial" : essai d'un nouveau compte, en cours ou terminé
  // "pro" : abonnement Pro en cours de validité
  plan: "free" | "trial" | "pro";
  // false : l'application est bloquée jusqu'à l'abonnement
  isActive: boolean;
  isTrialExpired: boolean;
  isSubscriptionExpired: boolean;
  trialDaysLeft: number;
  hasClientLimit: boolean;
  // true : Pro payé par PayTech, à renouveler à la main chaque mois (pas de prélèvement automatique)
  renewsManually: boolean;
  endDate: string | null;
};

// Règle unique d'accès : appelée par l'écran de blocage, les limites de clients et le tableau de bord admin
export function resolveSubscription(sub: SubscriptionRow | null | undefined, now: Date = new Date()): SubscriptionAccess {
  // Un compte sans ligne d'abonnement est une anomalie : on ne le bloque pas, mais il reste limité
  if (!sub) {
    return { plan: "free", isActive: true, isTrialExpired: false, isSubscriptionExpired: false, trialDaysLeft: 0, hasClientLimit: true, renewsManually: false, endDate: null };
  }

  const createdAt = new Date(sub.created_at);
  const isLegacy = createdAt < new Date(LEGACY_FREE_CUTOFF);

  // Seuls les paiements PayTech sont ponctuels (un paiement = un mois) ; un abonnement Stripe
  // est reconduit et son état est tenu à jour par le webhook Stripe.
  const isPayTech = !!sub.stripe_subscription_id?.startsWith("paytech_");
  const periodEnd = sub.current_period_end ? new Date(sub.current_period_end) : null;
  const isProLapsed = sub.plan_type === "pro" && isPayTech && !!periodEnd
    && now.getTime() > periodEnd.getTime() + PRO_GRACE_DAYS * DAY_MS;

  if (sub.plan_type === "pro" && !isProLapsed) {
    return { plan: "pro", isActive: true, isTrialExpired: false, isSubscriptionExpired: false, trialDaysLeft: 0, hasClientLimit: false, renewsManually: isPayTech, endDate: sub.current_period_end };
  }

  if (isLegacy) {
    return { plan: "free", isActive: true, isTrialExpired: false, isSubscriptionExpired: isProLapsed, trialDaysLeft: 0, hasClientLimit: true, renewsManually: false, endDate: sub.current_period_end };
  }

  if (isProLapsed) {
    return { plan: "trial", isActive: false, isTrialExpired: false, isSubscriptionExpired: true, trialDaysLeft: 0, hasClientLimit: false, renewsManually: false, endDate: sub.current_period_end };
  }

  const daysSinceSignup = Math.floor((now.getTime() - createdAt.getTime()) / DAY_MS);
  const trialDaysLeft = Math.max(0, TRIAL_DURATION_DAYS - daysSinceSignup);
  const isOver = trialDaysLeft === 0;
  // Un compte qui a déjà payé puis arrêté n'est pas « en fin d'essai » : son abonnement est terminé
  const hadSubscription = !!sub.stripe_subscription_id;

  return {
    plan: "trial",
    isActive: !isOver,
    isTrialExpired: isOver && !hadSubscription,
    isSubscriptionExpired: isOver && hadSubscription,
    trialDaysLeft,
    // L'essai donne accès à la formule Pro complète : pas de limite de clients pendant ces 14 jours
    hasClientLimit: false,
    renewsManually: false,
    endDate: null,
  };
}
