"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { mockClientsRepository } from "@/lib/data-access";

export async function createClientAction(formData: FormData) {
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    notes: formData.get("notes") as string,
  };

  try {
    const newClient = await mockClientsRepository.addClient(data);
    revalidatePath("/clients");
    return { success: true, clientId: newClient.id };
  } catch (error: any) {
    if (error.message === "LIMITE_ATTEINTE") {
      return { error: "LIMIT_REACHED" };
    }
    return { error: error.message };
  }
}

export async function deleteClientAction(id: string) {
  await mockClientsRepository.deleteClient(id);
  revalidatePath("/clients");
}

export async function updateClientAction(id: string, formData: FormData) {
  const data = {
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    notes: formData.get("notes") as string,
  };

  await mockClientsRepository.updateClient(id, data);
  revalidatePath("/clients");
  revalidatePath(`/clients/${id}`);
  redirect(`/clients/${id}`);
}

export async function saveClientMeasurementsAction(clientId: string, formData: FormData) {
  const measurements: Record<string, number> = {};
  formData.forEach((value, key) => {
    if (key.startsWith("measure_") && value) {
      const numValue = parseFloat(value as string);
      if (!isNaN(numValue)) {
        measurements[key.replace("measure_", "")] = numValue;
      }
    }
  });

  await mockClientsRepository.updateClientMeasurements(clientId, measurements);
  revalidatePath(`/clients/${clientId}`);
}
