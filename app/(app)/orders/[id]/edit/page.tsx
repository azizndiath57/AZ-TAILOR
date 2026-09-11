import Link from "next/link";
import { OrdersRepository } from "@/lib/data-access";
import { mockClientsRepository } from "@/lib/data-access";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import EditOrderForm from "./EditOrderForm";

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Fetch order and clients concurrently
  const [orders, clients] = await Promise.all([
    OrdersRepository.getOrders(),
    mockClientsRepository.getClients()
  ]);

  const order = orders.find(o => o.id === resolvedParams.id);

  if (!order) {
    notFound();
  }

  const t = await getTranslations("OrderForm");

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href={`/orders`} 
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-xl">arrow_back</span>
        </Link>
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-800">{t("editTitle")}</h2>
          <p className="text-sm text-gray-500 mt-1">{t("editSubtitle")}</p>
        </div>
      </div>

      <EditOrderForm order={order} clients={clients} />
    </div>
  );
}

