"use server";

import { revalidatePath } from "next/cache";
import { mockNotificationsRepository } from "@/lib/data-access";

export async function getNotificationsAction() {
  return await mockNotificationsRepository.getNotifications();
}

export async function markAsReadAction(id: string) {
  await mockNotificationsRepository.markAsRead(id);
  revalidatePath("/", "layout");
}

export async function markAllAsReadAction() {
  await mockNotificationsRepository.markAllAsRead();
  revalidatePath("/", "layout");
}

export async function clearAllNotificationsAction() {
  await mockNotificationsRepository.clearAll();
  revalidatePath("/", "layout");
}
