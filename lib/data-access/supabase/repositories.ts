import { createClient } from '@/utils/supabase/server';
import { 
  Order, 
  OrderWithFinancials, 
  DashboardStats, 
  AppNotification, 
  Client, 
  WorkshopSettings 
} from '../types';

// Helper to get authenticated user
async function getUserId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non autorisé");
  return user.id;
}

export const SupabaseDashboardRepository = {
  async getStats(from?: string, to?: string): Promise<DashboardStats> {
    const supabase = await createClient();
    
    let baseOrderQuery = supabase.from('orders').select('*', { count: 'exact', head: true });
    let baseOrderQueryWait = supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'en_attente');
    let baseOrderQueryProg = supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'en_cours');
    let baseOrderQueryPret = supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pret');
    let baseOrderQueryLivr = supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'livre');
    
    let paymentsQuery = supabase.from('payments').select('amount');
    let ordersPriceQuery = supabase.from('orders').select('total_price');

    if (from) {
      baseOrderQuery = baseOrderQuery.gte('created_at', from);
      baseOrderQueryWait = baseOrderQueryWait.gte('created_at', from);
      baseOrderQueryProg = baseOrderQueryProg.gte('created_at', from);
      baseOrderQueryPret = baseOrderQueryPret.gte('created_at', from);
      baseOrderQueryLivr = baseOrderQueryLivr.gte('created_at', from);
      paymentsQuery = paymentsQuery.gte('created_at', from);
      ordersPriceQuery = ordersPriceQuery.gte('created_at', from);
    }
    
    if (to) {
      // Append time to include the whole day
      const toEndOfDay = `${to}T23:59:59.999Z`;
      baseOrderQuery = baseOrderQuery.lte('created_at', toEndOfDay);
      baseOrderQueryWait = baseOrderQueryWait.lte('created_at', toEndOfDay);
      baseOrderQueryProg = baseOrderQueryProg.lte('created_at', toEndOfDay);
      baseOrderQueryPret = baseOrderQueryPret.lte('created_at', toEndOfDay);
      baseOrderQueryLivr = baseOrderQueryLivr.lte('created_at', toEndOfDay);
      paymentsQuery = paymentsQuery.lte('created_at', toEndOfDay);
      ordersPriceQuery = ordersPriceQuery.lte('created_at', toEndOfDay);
    }

    const [
      { count: totalOrders },
      { count: waitingOrders },
      { count: inProgressOrders },
      { count: readyOrders },
      { count: deliveredOrders },
    ] = await Promise.all([
      baseOrderQuery,
      baseOrderQueryWait,
      baseOrderQueryProg,
      baseOrderQueryPret,
      baseOrderQueryLivr,
    ]);

    const { data: payments } = await paymentsQuery;
    const { data: orders } = await ordersPriceQuery;
    
    const monthlyRevenue = payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
    const totalPrices = orders?.reduce((sum, o) => sum + Number(o.total_price), 0) || 0;
    const totalBalanceDue = Math.max(0, totalPrices - monthlyRevenue);

    return {
      totalOrders: totalOrders || 0,
      waitingOrders: waitingOrders || 0,
      inProgressOrders: inProgressOrders || 0,
      readyOrders: readyOrders || 0,
      deliveredOrders: deliveredOrders || 0,
      monthlyRevenue,
      totalBalanceDue
    };
  }
};

export const SupabaseNotificationsRepository = {
  async getNotifications(): Promise<AppNotification[]> {
    const supabase = await createClient();
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false });
      
    return (data || []).map(n => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type as any,
      isRead: n.is_read,
      createdAt: new Date(n.created_at)
    }));
  },
  async markAsRead(id: string) {
    const supabase = await createClient();
    await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  },
  async markAllAsRead() {
    const supabase = await createClient();
    const user_id = await getUserId();
    await supabase.from('notifications').update({ is_read: true }).eq('owner_id', user_id);
  },
  async clearAll() {
    const supabase = await createClient();
    const user_id = await getUserId();
    await supabase.from('notifications').delete().eq('owner_id', user_id);
  }
};

export const SupabaseOrdersRepository = {
  async getOrders(): Promise<OrderWithFinancials[]> {
    const supabase = await createClient();
    const { data: ordersData } = await supabase
      .from('orders')
      .select(`
        *,
        clients(*),
        payments(amount)
      `)
      .order('created_at', { ascending: false });

    return (ordersData || []).map(o => {
      const totalPaid = o.payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
      const totalPrice = Number(o.total_price);
      return {
        id: o.id,
        clientId: o.client_id,
        reference: o.reference,
        garmentType: o.garment_type,
        fabricText: o.fabric_text,
        fabricPhotoUrl: o.fabric_photo_url,
        measurements: o.measurements,
        totalPrice,
        status: o.status as any,
        expectedDeliveryDate: new Date(o.expected_delivery_date),
        clientSignature: o.client_signature || null,
        createdAt: new Date(o.created_at),
        client: {
          id: o.clients.id,
          firstName: o.clients.first_name,
          lastName: o.clients.last_name,
          phone: o.clients.phone,
          address: o.clients.address,
          notes: o.clients.notes,
          measurements: o.clients.measurements,
          createdAt: new Date(o.clients.created_at)
        },
        totalPaid,
        balanceDue: Math.max(0, totalPrice - totalPaid),
        paymentStatus: totalPaid === 0 ? "non_paye" : totalPaid >= totalPrice ? "paye" : "partiel"
      };
    });
  },
  
  async getOrderById(orderId: string): Promise<OrderWithFinancials | null> {
    const supabase = await createClient();
    const { data: o } = await supabase
      .from('orders')
      .select(`
        *,
        clients(*),
        payments(amount)
      `)
      .eq('id', orderId)
      .single();

    if (!o) return null;
    
    const totalPaid = o.payments?.reduce((sum: number, p: any) => sum + Number(p.amount), 0) || 0;
    const totalPrice = Number(o.total_price);
    
    return {
      id: o.id,
      clientId: o.client_id,
      reference: o.reference,
      garmentType: o.garment_type,
      fabricText: o.fabric_text,
      fabricPhotoUrl: o.fabric_photo_url,
      measurements: o.measurements,
      totalPrice,
      status: o.status as any,
      expectedDeliveryDate: new Date(o.expected_delivery_date),
      clientSignature: o.client_signature || null,
      createdAt: new Date(o.created_at),
      client: {
        id: o.clients.id,
        firstName: o.clients.first_name,
        lastName: o.clients.last_name,
        phone: o.clients.phone,
        address: o.clients.address,
        notes: o.clients.notes,
        measurements: o.clients.measurements,
        createdAt: new Date(o.clients.created_at)
      },
      totalPaid,
      balanceDue: Math.max(0, totalPrice - totalPaid),
      paymentStatus: totalPaid === 0 ? "non_paye" : totalPaid >= totalPrice ? "paye" : "partiel"
    };
  },
  
  async addOrder(data: Partial<Order>, clientData: Partial<Client>) {
    const supabase = await createClient();
    const user_id = await getUserId();
    
    let clientId = clientData.id;
    
    if (!clientId) {
      // Vérification des limites (Freemium)
      const { data: sub } = await supabase.from('subscriptions').select('plan_type').eq('owner_id', user_id).single();
      if (!sub || sub.plan_type === 'free') {
        const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('owner_id', user_id);
        if (count !== null && count >= 20) {
          throw new Error("LIMITE_ATTEINTE");
        }
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: newClient, error } = await supabase.from('clients').insert({
        owner_id: user_id,
        first_name: clientData.firstName || "Nouveau",
        last_name: clientData.lastName || "Client",
        phone: clientData.phone || "",
        measurements: clientData.measurements || null
      }).select().single();
      
      if (error) {
        console.error("Error creating client during addOrder:", error);
        throw new Error(error.message);
      }
      
      clientId = newClient.id;
    } else if (clientData.measurements) {
      // Update existing client measurements
      const { data: existingClient } = await supabase.from('clients').select('measurements').eq('id', clientId).single();
      await supabase.from('clients').update({
        measurements: { ...(existingClient?.measurements || {}), ...clientData.measurements }
      }).eq('id', clientId);
    }
    
    const year = new Date().getFullYear();
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${year}-01-01T00:00:00.000Z`)
      .lte('created_at', `${year}-12-31T23:59:59.999Z`);
      
    const sequence = (count || 0) + 1;
    const paddedSequence = sequence.toString().padStart(4, "0");
    const reference = `CMD-${year}-${paddedSequence}`;
    
    const { data: newOrder, error: orderError } = await supabase.from('orders').insert({
      owner_id: user_id,
      client_id: clientId,
      reference,
      garment_type: data.garmentType || "Costume",
      fabric_text: data.fabricText || null,
      fabric_photo_url: data.fabricPhotoUrl || null,
      total_price: data.totalPrice || 0,
      expected_delivery_date: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }).select().single();
    
    if (orderError) {
      console.error("Error creating order:", orderError);
      throw new Error(orderError.message);
    }
    
    return newOrder;
  },
  
  async deleteOrder(orderId: string) {
    const supabase = await createClient();
    await supabase.from('orders').delete().eq('id', orderId);
  },
  
  async updateOrder(orderId: string, data: Partial<Order> & { totalPaid?: number }) {
    const supabase = await createClient();
    const user_id = await getUserId();
    
    const updates: any = {};
    if (data.clientId !== undefined) updates.client_id = data.clientId;
    if (data.garmentType !== undefined) updates.garment_type = data.garmentType;
    if (data.fabricText !== undefined) updates.fabric_text = data.fabricText;
    if (data.fabricPhotoUrl !== undefined) updates.fabric_photo_url = data.fabricPhotoUrl;
    if (data.expectedDeliveryDate !== undefined) updates.expected_delivery_date = new Date(data.expectedDeliveryDate).toISOString();
    if (data.totalPrice !== undefined) updates.total_price = data.totalPrice;
    if (data.status !== undefined) updates.status = data.status;
    
    if (Object.keys(updates).length > 0) {
      await supabase.from('orders').update(updates).eq('id', orderId);
    }
    
    if (data.totalPaid !== undefined) {
      // For simplicity, we just delete all existing payments for this order and insert one new payment
      await supabase.from('payments').delete().eq('order_id', orderId);
      
      if (data.totalPaid > 0) {
        await supabase.from('payments').insert({
          owner_id: user_id,
          order_id: orderId,
          amount: data.totalPaid,
          method: 'cash'
        });
      }
    }
  },

  async addPayment(orderId: string, amount: number, method: string, signature?: string | null) {
    const supabase = await createClient();
    const user_id = await getUserId();
    
    await supabase.from('payments').insert({
      owner_id: user_id,
      order_id: orderId,
      amount,
      method
    });

    if (signature) {
      await supabase.from('orders').update({ client_signature: signature }).eq('id', orderId);
    }
  }
};

export const SupabaseClientsRepository = {
  async getClients() {
    const supabase = await createClient();
    const { data: clientsData } = await supabase
      .from('clients')
      .select(`
        *,
        orders(id)
      `)
      .order('created_at', { ascending: false });
      
    return (clientsData || []).map(c => ({
      id: c.id,
      firstName: c.first_name,
      lastName: c.last_name,
      phone: c.phone,
      address: c.address,
      notes: c.notes,
      measurements: c.measurements,
      createdAt: new Date(c.created_at),
      ordersCount: c.orders?.length || 0
    }));
  },
  
  async getClientById(id: string) {
    const supabase = await createClient();
    const { data: c } = await supabase
      .from('clients')
      .select(`
        *,
        orders(*)
      `)
      .eq('id', id)
      .single();
      
    if (!c) return null;
    
    return {
      id: c.id,
      firstName: c.first_name,
      lastName: c.last_name,
      phone: c.phone,
      address: c.address,
      notes: c.notes,
      measurements: c.measurements,
      createdAt: new Date(c.created_at),
      orders: (c.orders || []).map((o: any) => ({
        id: o.id,
        reference: o.reference,
        garmentType: o.garment_type,
        fabricText: o.fabric_text || null,
        fabricPhotoUrl: o.fabric_photo_url || null,
        totalPrice: Number(o.total_price),
        status: o.status,
        expectedDeliveryDate: new Date(o.expected_delivery_date)
      }))
    };
  },
  
  async addClient(data: Partial<Client>) {
    const supabase = await createClient();
    const user_id = await getUserId();
    
    // Vérification des limites (Freemium)
    const { data: sub } = await supabase.from('subscriptions').select('plan_type').eq('owner_id', user_id).single();
    if (!sub || sub.plan_type === 'free') {
      const { count } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('owner_id', user_id);
      if (count !== null && count >= 20) {
        throw new Error("LIMITE_ATTEINTE");
      }
    }

    const { data: newClient } = await supabase.from('clients').insert({
      owner_id: user_id,
      first_name: data.firstName || "Nouveau",
      last_name: data.lastName || "Client",
      phone: data.phone || "",
      address: data.address || null,
      notes: data.notes || null,
      measurements: data.measurements || {}
    }).select().single();
    
    return {
      id: newClient.id,
      firstName: newClient.first_name,
      lastName: newClient.last_name,
      phone: newClient.phone,
      address: newClient.address,
      notes: newClient.notes,
      measurements: newClient.measurements,
      createdAt: new Date(newClient.created_at),
      ordersCount: 0
    };
  },
  
  async updateClientMeasurements(id: string, measurements: Record<string, number>) {
    const supabase = await createClient();
    const { data: client } = await supabase.from('clients').select('measurements').eq('id', id).single();
    await supabase.from('clients').update({
      measurements: { ...(client?.measurements || {}), ...measurements }
    }).eq('id', id);
  },
  
  async updateClient(id: string, data: Partial<Client>) {
    const supabase = await createClient();
    const updates: any = {};
    if (data.firstName !== undefined) updates.first_name = data.firstName;
    if (data.lastName !== undefined) updates.last_name = data.lastName;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.address !== undefined) updates.address = data.address;
    if (data.notes !== undefined) updates.notes = data.notes;
    if (data.measurements !== undefined) updates.measurements = data.measurements;
    
    await supabase.from('clients').update(updates).eq('id', id);
  },
  
  async deleteClient(id: string) {
    const supabase = await createClient();
    await supabase.from('clients').delete().eq('id', id);
  }
};

export const SupabaseSettingsRepository = {
  async getSettings(): Promise<WorkshopSettings> {
    const supabase = await createClient();
    const owner_id = await getUserId();
    
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('owner_id', owner_id)
      .single();
      
    if (!settings) {
      return {
        ownerId: owner_id,
        workshopName: "Mon Atelier",
        slogan: null,
        address: null,
        phone: null,
        logoUrl: null
      };
    }
    
    return {
      ownerId: settings.owner_id,
      workshopName: settings.workshop_name,
      slogan: settings.slogan,
      address: settings.address,
      phone: settings.phone,
      logoUrl: settings.logo_url
    };
  },
  
  async updateSettings(data: Partial<WorkshopSettings>) {
    const supabase = await createClient();
    const owner_id = await getUserId();
    
    const updates: any = { owner_id };
    if (data.workshopName !== undefined) updates.workshop_name = data.workshopName;
    if (data.slogan !== undefined) updates.slogan = data.slogan;
    if (data.address !== undefined) updates.address = data.address;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.logoUrl !== undefined) updates.logo_url = data.logoUrl;
    
    await supabase.from('settings').upsert(updates, { onConflict: 'owner_id' });
  }
};
