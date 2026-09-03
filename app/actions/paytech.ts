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

  const orderId = `order_${Date.now()}_${user.id.substring(0, 5)}`;
  const amount = 5000; // Montant de l'abonnement
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.aztailor.org';
  
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
      item_price: amount,
      currency: "XOF",
      ref_command: orderId,
      command_name: "Abonnement",
      env: process.env.NODE_ENV === 'production' ? 'live' : 'test',
      success_url: siteUrl.startsWith('http://') 
        ? `https://aztailor.org/settings?success=true`
        : `${siteUrl}/settings?success=true`,
      ipn_url: siteUrl.startsWith('http://') 
        ? `https://aztailor.org/api/webhooks/paytech`
        : `${siteUrl}/api/webhooks/paytech`,
      cancel_url: siteUrl.startsWith('http://')
        ? `https://aztailor.org/settings?canceled=true`
        : `${siteUrl}/settings?canceled=true`,
      custom_field: JSON.stringify({ custom_user_id: user.id })
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
