import { stripe } from '@/lib/stripe';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Nous utilisons le service_role key car ce webhook s'exécute côté serveur sans session utilisateur active (bypass RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('Stripe-Signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (event.type === 'checkout.session.completed') {
    // Le paiement a réussi
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    const userId = session.client_reference_id;

    if (userId) {
      await supabaseAdmin
        .from('subscriptions')
        .update({
          stripe_subscription_id: subscription.id,
          stripe_customer_id: subscription.customer as string,
          plan_type: 'pro',
          status: subscription.status,
          current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        })
        .eq('owner_id', userId);
    }
  }

  if (event.type === 'invoice.payment_succeeded') {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await supabaseAdmin
      .from('subscriptions')
      .update({
        plan_type: 'pro',
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  if (event.type === 'customer.subscription.deleted' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
        // Si l'abonnement est annulé/supprimé, on le repasse en 'free' (selon la logique métier voulue)
        plan_type: subscription.status === 'active' ? 'pro' : 'free',
      })
      .eq('stripe_subscription_id', subscription.id);
  }

  return NextResponse.json({ received: true });
}
