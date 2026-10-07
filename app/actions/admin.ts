"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { createClient } from "@/utils/supabase/server";
import { resolveSubscription } from "@/lib/subscription";

// Une Server Action est appelable par simple requête POST : le contrôle du layout /admin
// ne la protège pas, il faut donc revérifier le rôle ici avant d'utiliser la clé service_role.
async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") throw new Error("Non autorisé");
}

export async function getAdminDashboardData() {
  await requireAdmin();

  const supabase = createAdminClient();

  // 1. Fetch all profiles
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, phone, nom_atelier, role, created_at")
    .order("created_at", { ascending: false });

  if (profilesError) {
    console.error("Error fetching profiles:", profilesError);
    return { users: [], totalUsers: 0, activeSubscriptions: 0 };
  }

  // 2. Fetch all subscriptions
  const { data: subscriptions, error: subError } = await supabase
    .from("subscriptions")
    .select("owner_id, plan_type, status, current_period_end, created_at, stripe_subscription_id");

  if (subError) {
    console.error("Error fetching subscriptions:", subError);
    return { users: [], totalUsers: 0, activeSubscriptions: 0 };
  }

  // 3. Merge data
  const users = profiles.map(profile => {
    const sub = subscriptions.find(s => s.owner_id === profile.id);

    // Même règle que celle qui bloque ou non l'application de l'atelier
    return {
      ...profile,
      subscription: sub ? { ...resolveSubscription(sub), status: sub.status } : null
    };
  });

  const totalUsers = users.length;
  const activeSubscriptions = users.filter(u => u.subscription?.plan === 'pro').length;

  return {
    users,
    totalUsers,
    activeSubscriptions
  };
}
