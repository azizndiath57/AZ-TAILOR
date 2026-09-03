'use server';

import { createClient } from '@/utils/supabase/server';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

export async function createCheckoutSession() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Vous devez être connecté pour vous abonner.' };
    }

  // Obtenir l'URL de base pour la redirection après paiement
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  // Créer une session Stripe Checkout avec le prix configuré à la volée (price_data)
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    billing_address_collection: 'auto',
    customer_email: user.email,
    line_items: [
      {
        price_data: {
          currency: 'xof',
          product_data: {
            name: 'AZ-TAILOR Pro',
            description: 'Nombre illimité de clients, logo sur les factures, bouton WhatsApp.',
          },
          // 5000 FCFA. Stripe pour les devises sans décimales (comme le XOF) 
          // prend le montant exact (pas de multiplication par 100)
          unit_amount: 5000, 
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      },
    ],
    mode: 'subscription',
    success_url: `${baseUrl}/settings?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/settings?canceled=true`,
    metadata: {
      userId: user.id, // Important pour le Webhook
    },
    // client_reference_id est utile pour le webhook checkout.session.completed
    client_reference_id: user.id,
  });

    if (!session.url) {
      return { error: 'Erreur lors de la création de la session Stripe.' };
    }

    return { url: session.url };
  } catch (err: any) {
    return { error: err.message || 'Une erreur est survenue avec Stripe.' };
  }
}

export async function createCustomerPortalSession() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: 'Vous devez être connecté.' };
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('owner_id', user.id)
      .single();

    if (!subscription || !subscription.stripe_customer_id) {
      return { error: "Vous n'avez pas d'abonnement actif." };
    }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${baseUrl}/settings`,
    });

    return { url: portalSession.url };
  } catch (err: any) {
    return { error: err.message || 'Une erreur est survenue avec le portail Stripe.' };
  }
}
