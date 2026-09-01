import { OrdersRepository } from "@/lib/data-access";
import FittingsClient from "./FittingsClient";

export default async function FittingsPage() {
  const orders = await OrdersRepository.getOrders();
  
  return <FittingsClient orders={orders} />;
}
