import { notFound } from "next/navigation";
import { OrdersRepository } from "@/lib/data-access";
import PaymentClient from "./PaymentClient";

export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const order = await OrdersRepository.getOrderById(resolvedParams.id);

  if (!order) {
    notFound();
  }

  return <PaymentClient order={order} />;
}
