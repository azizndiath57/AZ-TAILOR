import { Client, DashboardStats, Order, OrderWithFinancials, Payment, AppNotification } from "../types";

// In-memory store (persist across HMR)
const globalForMockDb = globalThis as unknown as {
  mockClients: Client[];
  mockOrders: Order[];
  mockPayments: Payment[];
  mockNotifications: AppNotification[];
  mockSettings: any;
};

let settings = globalForMockDb.mockSettings || {
  workshopName: "AZ-TAILOR",
  address: "Dakar, Sénégal",
  phone: "+221 77 123 45 67",
  logoUrl: null
};

const clients: Client[] = globalForMockDb.mockClients || [
  { id: "c1", firstName: "Fatou", lastName: "Diop", phone: "+221770000001", address: "Dakar", notes: "Aime les couleurs vives", createdAt: new Date() },
  { id: "c2", firstName: "Jean", lastName: "Dupont", phone: "+225010000002", address: "Abidjan", notes: null, createdAt: new Date() }
];

const orders: Order[] = globalForMockDb.mockOrders || [
  {
    id: "o1",
    clientId: "c1",
    reference: "CMD-2026-0001",
    garmentType: "Boubou",
    fabricText: "Bazin riche",
    fabricPhotoUrl: null,
    measurements: { poitrine: 90, taille: 75, longueur_vetement: 140 },
    totalPrice: 50000,
    status: "en_cours",
    expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
    createdAt: new Date()
  },
  {
    id: "o2",
    clientId: "c2",
    reference: "CMD-2026-0002",
    garmentType: "Costume",
    fabricText: "Laine",
    fabricPhotoUrl: null,
    measurements: { poitrine: 100, carrure: 45, longueur_pantalon: 105 },
    totalPrice: 120000,
    status: "en_attente",
    expectedDeliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // late by 1 day
    createdAt: new Date()
  }
];

const payments: Payment[] = globalForMockDb.mockPayments || [
  { id: "p1", orderId: "o1", amount: 25000, method: "wave", recordedAt: new Date() },
  { id: "p2", orderId: "o2", amount: 0, method: "cash", recordedAt: new Date() }
];

const notifications: AppNotification[] = globalForMockDb.mockNotifications || [
  { id: "n1", title: "Nouvelle commande", message: "M. Dupont a passé une nouvelle commande de costume.", type: "info", isRead: false, createdAt: new Date() },
  { id: "n2", title: "Essayage aujourd'hui", message: "Essayage prévu avec Mme. Diop à 15h00.", type: "warning", isRead: false, createdAt: new Date(Date.now() - 3600000) },
  { id: "n3", title: "Paiement reçu", message: "Encaissement de 25 000 FCFA pour CMD-2026-0001.", type: "success", isRead: true, createdAt: new Date(Date.now() - 86400000) }
];

// Generate 25 extra clients and orders to test pagination
if (clients.length < 10) {
  const garmentTypes = ["Costume", "Chemise", "Pantalon", "Boubou", "Robe"];
  const statuses = ["en_attente", "en_cours", "pret", "livre", "annule"] as any[];
  
  for (let i = 3; i <= 27; i++) {
    const cId = `c${i}`;
    clients.push({
      id: cId,
      firstName: `Client`,
      lastName: `Test ${i}`,
      phone: `+22177000${i.toString().padStart(4, '0')}`,
      address: `Dakar, Quartier ${i}`,
      notes: `Généré automatiquement`,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    });
    
    const price = 20000 + Math.floor(Math.random() * 80000);
    const orderId = `o${i}`;
    orders.push({
      id: orderId,
      clientId: cId,
      reference: `CMD-2026-${i.toString().padStart(4, '0')}`,
      garmentType: garmentTypes[Math.floor(Math.random() * garmentTypes.length)],
      fabricText: `Tissu test ${i}`,
      fabricPhotoUrl: null,
      measurements: {},
      totalPrice: price,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      expectedDeliveryDate: new Date(Date.now() + (Math.random() * 14 - 7) * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000)
    });
    
    const paid = Math.random() > 0.5 ? price : (Math.random() > 0.5 ? Math.floor(price / 2) : 0);
    if (paid > 0) {
      payments.push({
        id: `p${i}`,
        orderId,
        amount: paid,
        method: Math.random() > 0.5 ? "wave" : "cash",
        recordedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000)
      });
    }
  }
}

if (process.env.NODE_ENV !== "production") {
  globalForMockDb.mockClients = clients;
  globalForMockDb.mockOrders = orders;
  globalForMockDb.mockPayments = payments;
  globalForMockDb.mockNotifications = notifications;
  globalForMockDb.mockSettings = settings;
}

export const mockDashboardRepository = {
  async getStats(): Promise<DashboardStats> {
    const totalOrders = orders.length;
    const waitingOrders = orders.filter(o => o.status === "en_attente").length;
    const inProgressOrders = orders.filter(o => o.status === "en_cours").length;
    const readyOrders = orders.filter(o => o.status === "pret").length;
    const deliveredOrders = orders.filter(o => o.status === "livre").length;

    const monthlyRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const totalExpected = orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const totalBalanceDue = Math.max(0, totalExpected - monthlyRevenue);

    return {
      totalOrders,
      waitingOrders,
      inProgressOrders,
      readyOrders,
      deliveredOrders,
      monthlyRevenue,
      totalBalanceDue
    };
  }
};

export const mockOrdersRepository = {
  async getOrders(): Promise<OrderWithFinancials[]> {
    return orders.map(o => {
      const client = clients.find(c => c.id === o.clientId)!;
      const orderPayments = payments.filter(p => p.orderId === o.id);
      const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);
      return {
        ...o,
        client,
        totalPaid,
        balanceDue: Math.max(0, o.totalPrice - totalPaid),
        paymentStatus: totalPaid === 0 ? "non_paye" : totalPaid >= o.totalPrice ? "paye" : "partiel"
      };
    });
  },
  async getOrderById(orderId: string): Promise<OrderWithFinancials | null> {
    const order = orders.find(o => o.id === orderId);
    if (!order) return null;
    
    const client = clients.find(c => c.id === order.clientId)!;
    const orderPayments = payments.filter(p => p.orderId === order.id);
    const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);
    
    return {
      ...order,
      client,
      totalPaid,
      balanceDue: Math.max(0, order.totalPrice - totalPaid),
      paymentStatus: totalPaid === 0 ? "non_paye" : totalPaid >= order.totalPrice ? "paye" : "partiel"
    };
  },
  async addOrder(data: Partial<Order>, clientData: Partial<Client>) {
    // Basic mock logic to create client and order
    let clientId = clientData.id;
    if (!clientId) {
      clientId = `c${Date.now()}`;
      clients.push({
        id: clientId,
        firstName: clientData.firstName || "Nouveau",
        lastName: clientData.lastName || "Client",
        phone: clientData.phone || "",
        address: null,
        notes: null,
        measurements: clientData.measurements,
        createdAt: new Date()
      });
    } else if (clientData.measurements) {
      const existingClient = clients.find(c => c.id === clientId);
      if (existingClient) {
        existingClient.measurements = { ...(existingClient.measurements || {}), ...clientData.measurements };
      }
    }
    const newOrder: Order = {
      id: `o${Date.now()}`,
      clientId,
      reference: `CMD-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(4, '0')}`,
      garmentType: data.garmentType || "Costume",
      fabricText: data.fabricText || null,
      fabricPhotoUrl: null,
      measurements: {},
      totalPrice: data.totalPrice || 0,
      status: "en_attente",
      expectedDeliveryDate: data.expectedDeliveryDate ? new Date(data.expectedDeliveryDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      createdAt: new Date()
    };
    orders.push(newOrder);
    return newOrder;
  },
  async deleteOrder(orderId: string) {
    const index = orders.findIndex(o => o.id === orderId);
    if (index > -1) {
      orders.splice(index, 1);
    }
  },
  async updateOrder(orderId: string, data: Partial<Order> & { totalPaid?: number }) {
    const index = orders.findIndex(o => o.id === orderId);
    if (index > -1) {
      orders[index] = { ...orders[index], ...data };
      
      // Update payment if totalPaid is provided
      if (data.totalPaid !== undefined) {
        const orderPayments = payments.filter(p => p.orderId === orderId);
        if (orderPayments.length > 0) {
          orderPayments[0].amount = data.totalPaid;
        } else {
          payments.push({
            id: `p${Date.now()}`,
            orderId,
            amount: data.totalPaid,
            method: "cash",
            recordedAt: new Date()
          });
        }
      }
    }
  }
};

export const mockClientsRepository = {
  async getClients() {
    return clients.map(client => {
      const clientOrders = orders.filter(o => o.clientId === client.id);
      return {
        ...client,
        ordersCount: clientOrders.length
      };
    });
  },
  async getClientById(id: string) {
    const client = clients.find(c => c.id === id);
    if (!client) return null;
    const clientOrders = orders.filter(o => o.clientId === client.id);
    return {
      ...client,
      orders: clientOrders.map(o => {
        const orderPayments = payments.filter(p => p.orderId === o.id);
        const totalPaid = orderPayments.reduce((sum, p) => sum + p.amount, 0);
        return {
          ...o,
          totalPaid
        };
      })
    };
  },
  async addClient(data: Partial<Client>) {
    const newClient: Client = {
      id: `c${Date.now()}`,
      firstName: data.firstName || "Nouveau",
      lastName: data.lastName || "Client",
      phone: data.phone || "",
      address: data.address || null,
      notes: data.notes || null,
      createdAt: new Date(),
    };
    clients.push(newClient);
    return newClient;
  },
  async deleteClient(id: string) {
    const index = clients.findIndex(c => c.id === id);
    if (index > -1) {
      clients.splice(index, 1);
    }
  },
  async updateClientMeasurements(id: string, measurements: Record<string, number>) {
    const client = clients.find(c => c.id === id);
    if (client) {
      client.measurements = measurements;
    }
  },
  async updateClient(id: string, data: Partial<Client>) {
    const index = clients.findIndex(c => c.id === id);
    if (index > -1) {
      clients[index] = { ...clients[index], ...data };
      return clients[index];
    }
    return null;
  }
};

export const mockNotificationsRepository = {
  async getNotifications() {
    return [...notifications].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },
  async markAsRead(id: string) {
    const notif = notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
  },
  async markAllAsRead() {
    notifications.forEach(n => n.isRead = true);
  },
  async clearAll() {
    notifications.splice(0, notifications.length);
  }
};

export const mockSettingsRepository = {
  async getSettings() {
    return settings;
  },
  async updateSettings(data: any) {
    settings = { ...settings, ...data };
    if (process.env.NODE_ENV !== "production") {
      globalForMockDb.mockSettings = settings;
    }
    return settings;
  }
};
