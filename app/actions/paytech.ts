'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export async function createPayTechCheckoutSession() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Utilisateur non connecté" };
    }

    const apiKey = process.env.PAYTECH_API_KEY;
    const apiSecret = process.env.PAYTECH_API_SECRET;
    
    if (!apiKey || !apiSecret) {
      return { error: "Clés API PayTech manquantes sur le serveur." };
    }

  // On intègre l'ID de l'utilisateur directement dans la référence pour l'IPN (format: timestamp__userid)
  const orderId = `${Date.now()}__${user.id}`;
  const amount = 5000; // Montant de l'abonnement
  
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aztailor.org').replace(/\/$/, '');
  
  // Requête vers PayTech
  const response = await fetch('https://paytech.sn/api/payment/request-payment', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'API_KEY': apiKey,
      'API_SECRET': apiSecret
    },
    body: JSON.stringify({
      item_name: "Abonnement PRO AZ-TAILOR",
      item_price: amount.toString(),
      currency: "XOF",
      ref_command: orderId,
      command_name: "Abonnement",
      env: "test",
      success_url: `${siteUrl}/settings?success=true`,
      ipn_url: `${siteUrl}/api/webhooks/paytech`,
      cancel_url: `${siteUrl}/settings?canceled=true`
    })
  });

    const data = await response.json();
    
    if (data.success === 1) {
      return { url: data.redirect_url };
    } else {
      return { error: `Erreur PayTech: ${data.message || JSON.stringify(data)}` };
    }
  } catch (err: any) {
    return { error: err.message || "Une erreur est survenue" };
  }
}
