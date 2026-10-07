import type { createClient } from "@/utils/supabase/server";
import { resolveSubscription } from "./subscription";

type ServerClient = Awaited<ReturnType<typeof createClient>>;

// Lit l'abonnement et le rôle de l'atelier connecté, puis applique la règle commune
export async function loadSubscriptionAccess(supabase: ServerClient, userId: string) {
  const [{ data: sub }, { data: profile }] = await Promise.all([
    supabase
      .from("subscriptions")
      .select("plan_type, current_period_end, created_at, stripe_subscription_id")
      .eq("owner_id", userId)
      .single(),
    supabase.from("profiles").select("role").eq("id", userId).single(),
  ]);

  return resolveSubscription(sub, { isAdmin: profile?.role === "admin" });
}
