import { 
  SupabaseDashboardRepository, 
  SupabaseOrdersRepository, 
  SupabaseClientsRepository,
  SupabaseSettingsRepository,
  SupabaseNotificationsRepository
} from "./supabase/repositories";

// Factory to switch between mock and supabase
// For full-stack migration, we force Supabase
const isMock = process.env.NEXT_PUBLIC_DATA_SOURCE === 'mock';

// We import mock repos dynamically or just ignore them for now. 
// Assuming we fully switched, we export Supabase ones directly.
import { Client, Order } from "./types";

export interface ClientsRepository {
  getClients: () => Promise<(Client & { ordersCount: number })[]>;
  getClientById: (id: string) => Promise<(Client & { orders: any[] }) | null>;
  getPublicClientAndSettings: (clientId: string) => Promise<{ client: { firstName: string, lastName: string }, settings: any } | null>;
  addClient: (data: Partial<Client>) => Promise<Client & { ordersCount: number }>;
  updateClientMeasurements: (id: string, measurements: Record<string, number>) => Promise<void>;
  updateClient: (id: string, data: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const DashboardRepository = SupabaseDashboardRepository;
export const OrdersRepository = SupabaseOrdersRepository;
export const ClientsRepository = SupabaseClientsRepository;
export const SettingsRepository = SupabaseSettingsRepository;
export const NotificationsRepository = SupabaseNotificationsRepository;

// Keep aliases for backward compatibility if used anywhere
export const mockSettingsRepository = SupabaseSettingsRepository;
export const mockClientsRepository = SupabaseClientsRepository;
export const mockNotificationsRepository = SupabaseNotificationsRepository;
export const mockOrdersRepository = SupabaseOrdersRepository;
export const mockDashboardRepository = SupabaseDashboardRepository;
