"use server";

import { createClient } from '@/utils/supabase/server';

export async function getSubscriptionStatus() {
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();
  
  if (!user) return { plan: 'free', isActive: false };

  const { data: sub } = await (await supabase)
    .from('subscriptions')
    .select('plan_type, status, current_period_end')
    .eq('owner_id', user.id)
    .single();

  if (!sub) return { plan: 'free', isActive: false };

  return {
    plan: sub.plan_type,
    isActive: sub.status === 'active' || sub.status === 'trialing',
    endDate: sub.current_period_end,
  };
}
