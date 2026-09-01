import { notFound } from "next/navigation";
import { OrdersRepository, mockSettingsRepository } from "@/lib/data-access";
import InvoiceClient from "./InvoiceClient";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const order = await OrdersRepository.getOrderById(resolvedParams.id);
  const settings = await mockSettingsRepository.getSettings();

  if (!order) {
    notFound();
  }

  return <InvoiceClient order={order} settings={settings} />;
}
