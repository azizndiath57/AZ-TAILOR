"use server";

import { createAdminClient } from "@/utils/supabase/admin";

export async function getAdminDashboardData() {
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
    .select("owner_id, plan_type, status, current_period_end, created_at");

  if (subError) {
    console.error("Error fetching subscriptions:", subError);
    return { users: [], totalUsers: 0, activeSubscriptions: 0 };
  }

  // 3. Merge data
  const users = profiles.map(profile => {
    const sub = subscriptions.find(s => s.owner_id === profile.id);
    
    // Calculate trial status for free plans
    let isTrialExpired = false;
    let trialDaysLeft = 0;
    
    if (sub && sub.plan_type === 'free') {
        const trialDurationDays = 30;
        const createdAt = new Date(sub.created_at);
        const now = new Date();
        const diffTime = now.getTime() - createdAt.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays >= trialDurationDays) {
            isTrialExpired = true;
        } else {
            trialDaysLeft = trialDurationDays - diffDays;
        }
    }

    return {
      ...profile,
      subscription: sub ? {
        plan: sub.plan_type,
        status: sub.status,
        endDate: sub.current_period_end,
        isTrialExpired,
        trialDaysLeft
      } : null
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
