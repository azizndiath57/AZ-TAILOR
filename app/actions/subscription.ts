"use server";

import { createClient } from '@/utils/supabase/server';

export type SubscriptionStatus = {
  plan: string;
  isActive: boolean;
  isTrialExpired: boolean;
  trialDaysLeft: number;
  endDate: string | null;
};

export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const supabase = createClient();
  const { data: { user } } = await (await supabase).auth.getUser();
  
  if (!user) return { plan: 'free', isActive: false, isTrialExpired: false, trialDaysLeft: 0, endDate: null };

  const { data: sub } = await (await supabase)
    .from('subscriptions')
    .select('plan_type, status, current_period_end, created_at')
    .eq('owner_id', user.id)
    .single();

  if (!sub) return { plan: 'free', isActive: false, isTrialExpired: false, trialDaysLeft: 0, endDate: null };

  let isActive = sub.status === 'active' || sub.status === 'trialing';
  let isTrialExpired = false;
  let trialDaysLeft = 0;

  if (sub.plan_type === 'free') {
      const trialDurationDays = 30;
      const createdAt = new Date(sub.created_at);
      const now = new Date();
      // Calculate diff in days
      const diffTime = now.getTime() - createdAt.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays >= trialDurationDays) {
          isTrialExpired = true;
          isActive = false; // Override isActive to false if trial is expired
      } else {
          trialDaysLeft = trialDurationDays - diffDays;
      }
  }

  return {
    plan: sub.plan_type,
    isActive,
    isTrialExpired,
    trialDaysLeft,
    endDate: sub.current_period_end,
  };
}
