'use server';

import { createClient } from '@/utils/supabase/server';
import { stripe } from '@/lib/stripe';
import { redirect } from 'next/navigation';

export async function createCheckoutSession() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    throw new Error('Vous devez être connecté pour vous abonner.');
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
    throw new Error('Erreur lors de la création de la session Stripe.');
  }

  // Rediriger l'utilisateur vers la page de paiement Stripe
  redirect(session.url);
}

export async function createCustomerPortalSession() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    throw new Error('Vous devez être connecté.');
  }

  // Récupérer l'ID client Stripe depuis notre table subscriptions
  const { data: subscription } = await (await supabase)
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('owner_id', user.id)
    .single();

  if (!subscription || !subscription.stripe_customer_id) {
    throw new Error("Vous n'avez pas d'abonnement actif.");
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${baseUrl}/settings`,
  });

  redirect(portalSession.url);
}
