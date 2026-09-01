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
