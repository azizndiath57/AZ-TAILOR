"use server";

import { createClient } from '@/utils/supabase/server';
import { resolveSubscription, type SubscriptionAccess } from '@/lib/subscription';

export type SubscriptionStatus = SubscriptionAccess;

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return resolveSubscription(null);

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan_type, current_period_end, created_at, stripe_subscription_id')
    .eq('owner_id', user.id)
    .single();

  return resolveSubscription(sub);
}
