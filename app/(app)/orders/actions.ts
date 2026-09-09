"use server";

import { revalidatePath } from "next/cache";
import { OrdersRepository } from "@/lib/data-access";

export async function createOrderAction(formData: FormData) {
  const clientId = formData.get("clientId") as string;
  const clientType = formData.get("client_type") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const phone = formData.get("phone") as string;
  
  const garmentType = formData.get("garmentType") as string;
  const fabricText = formData.get("fabricText") as string;
  const expectedDeliveryDate = formData.get("expectedDeliveryDate") as string;
  const totalPrice = Number(formData.get("totalPrice") || 0);

  let fabricPhotoUrl: string | undefined = undefined;
  const fabricPhoto = formData.get("fabricPhoto") as File | null;
  if (fabricPhoto && fabricPhoto.size > 0) {
    try {
      const { createClient } = await import("@/utils/supabase/server");
      const supabase = await createClient();
      const fileName = `${crypto.randomUUID()}-${fabricPhoto.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error } = await supabase.storage.from("fabric_photos").upload(fileName, fabricPhoto);
      if (!error) {
        const { data } = supabase.storage.from("fabric_photos").getPublicUrl(fileName);
        fabricPhotoUrl = data.publicUrl;
      }
    } catch (e) {
      console.error("Photo upload error:", e);
    }
  }

  const measurements: Record<string, number> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("measurement_") && value) {
      measurements[key.replace("measurement_", "")] = Number(value);
    }
  }

  console.log("CREATE ORDER ACTION CALLED with formData:", Object.fromEntries(formData.entries()));
  try {
    await OrdersRepository.addOrder({
      garmentType,
      fabricText,
      fabricPhotoUrl,
      totalPrice,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
    }, {
      id: clientId,
      firstName,
      lastName,
      phone,
      measurements: Object.keys(measurements).length > 0 ? measurements : undefined
    });

    console.log("ORDER ADDED SUCCESSFULLY");
    revalidatePath("/orders");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("ERROR IN CREATE ORDER ACTION:", err);
    return { error: err.message || "Erreur interne" };
  }
}

export async function deleteOrderAction(orderId: string) {
  await OrdersRepository.deleteOrder(orderId);
  revalidatePath("/orders");
  revalidatePath("/dashboard");
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  await OrdersRepository.updateOrder(orderId, { status: status as any });
  revalidatePath("/orders");
  revalidatePath("/dashboard");
}

export async function editOrderAction(formData: FormData) {
  const orderId = formData.get("orderId") as string;
  const clientId = formData.get("clientId") as string;
  const garmentType = formData.get("garmentType") as string;
  const fabricText = formData.get("fabricText") as string;
  const expectedDeliveryDate = formData.get("expectedDeliveryDate") as string;
  const totalPrice = Number(formData.get("totalPrice") || 0);
  const totalPaid = Number(formData.get("totalPaid") || 0);
  const status = formData.get("status") as string;
  const notes = formData.get("notes") as string;

  let fabricPhotoUrl: string | undefined = undefined;
  const fabricPhoto = formData.get("fabricPhoto") as File | null;
  if (fabricPhoto && fabricPhoto.size > 0) {
    try {
      const { createClient } = await import("@/utils/supabase/server");
      const supabase = await createClient();
      const fileName = `${crypto.randomUUID()}-${fabricPhoto.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const { error } = await supabase.storage.from("fabric_photos").upload(fileName, fabricPhoto);
      if (!error) {
        const { data } = supabase.storage.from("fabric_photos").getPublicUrl(fileName);
        fabricPhotoUrl = data.publicUrl;
      }
    } catch (e) {
      console.error("Photo upload error:", e);
    }
  }

  try {
    await OrdersRepository.updateOrder(orderId, {
      clientId: clientId || undefined,
      garmentType: garmentType || undefined,
      fabricText: fabricText || undefined,
      fabricPhotoUrl: fabricPhotoUrl || undefined,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : undefined,
      totalPrice: totalPrice || undefined,
      totalPaid: totalPaid !== undefined ? totalPaid : undefined,
      status: (status as any) || undefined,
      notes: notes || undefined,
    });

    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (err: any) {
    console.error("ERROR IN EDIT ORDER ACTION:", err);
    return { error: err.message || "Erreur interne" };
  }
}

export async function addPaymentAction(orderId: string, amount: number, method: string, signature?: string | null) {
  try {
    await OrdersRepository.addPayment(orderId, amount, method, signature);
    revalidatePath("/orders");
    revalidatePath(`/orders/${orderId}`);
    revalidatePath(`/orders/${orderId}/invoice`);
    revalidatePath("/dashboard");
    return { success: true };
  } catch (err: any) {
    console.error("ERROR IN ADD PAYMENT ACTION:", err);
    return { error: err.message || "Erreur interne" };
  }
}
