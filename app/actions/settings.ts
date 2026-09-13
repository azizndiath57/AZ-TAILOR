"use server";

import { revalidatePath } from "next/cache";
import { mockSettingsRepository } from "@/lib/data-access";

export async function getSettingsAction() {
  return await mockSettingsRepository.getSettings();
}

export async function updateSettingsAction(data: any) {
  await mockSettingsRepository.updateSettings(data);
  revalidatePath("/", "layout"); // Revalidate entire app to update invoices etc.
}

import { createClient } from "@/utils/supabase/server";

export async function getRecoveryCodeAction() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  let code = user.user_metadata?.recovery_code;
  
  if (!code) {
    // Generate one if the user doesn't have it yet (backward compatibility)
    code = Math.floor(100000 + Math.random() * 900000).toString();
    await supabase.auth.updateUser({
      data: { recovery_code: code }
    });
  }
  
  return code;
}
