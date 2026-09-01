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
