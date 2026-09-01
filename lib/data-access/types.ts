import { OrderStatus } from "../domain/order-status";
import { PaymentStatus } from "../domain/payment-status";
import { PaymentMethod } from "../constants/payment-methods";

export interface WorkshopSettings {
  ownerId: string;
  workshopName: string;
  slogan: string | null;
  address: string | null;
  phone: string | null;
  logoUrl: string | null;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success";
  isRead: boolean;
  createdAt: Date;
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string | null;
  notes: string | null;
  measurements?: Record<string, number>;
  createdAt: Date;
}

export interface Order {
  id: string;
  clientId: string;
  reference: string;
  garmentType: string;
  fabricText: string | null;
  fabricPhotoUrl: string | null;
  measurements: Record<string, number>;
  totalPrice: number;
  status: OrderStatus;
  expectedDeliveryDate: Date;
  notes?: string | null;
  createdAt: Date;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  method: PaymentMethod;
  recordedAt: Date;
}

// DTOs for joined data
export interface OrderWithFinancials extends Order {
  client: Client;
  totalPaid: number;
  balanceDue: number;
  paymentStatus: PaymentStatus;
}

export interface DashboardStats {
  totalOrders: number;
  waitingOrders: number;
  inProgressOrders: number;
  readyOrders: number;
  deliveredOrders: number;
  monthlyRevenue: number;
  totalBalanceDue: number;
}
