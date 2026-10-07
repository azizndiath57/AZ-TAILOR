"use server";

import { createClient } from '@/utils/supabase/server';
import { resolveSubscription, type SubscriptionAccess } from '@/lib/subscription';
import { loadSubscriptionAccess } from '@/lib/subscription-access';

export type SubscriptionStatus = SubscriptionAccess;

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return resolveSubscription(null);

  return loadSubscriptionAccess(supabase, user.id);
}
