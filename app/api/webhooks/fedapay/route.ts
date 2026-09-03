import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('x-fedapay-signature') as string;
  const webhookSecret = process.env.FEDAPAY_WEBHOOK_SECRET;

  if (webhookSecret && signature) {
    const hash = crypto.createHmac('sha256', webhookSecret).update(body).digest('hex');
    if (hash !== signature) {
      console.error('Webhook Error: Signature invalide');
      return NextResponse.json({ error: 'Signature invalide' }, { status: 401 });
    }
  }

  let event;
  try {
    event = JSON.parse(body);
  } catch (error: any) {
    console.error(`Webhook Error: JSON invalide`);
    return NextResponse.json({ error: 'JSON invalide' }, { status: 400 });
  }

  // FedaPay envoie souvent l'objet event avec un nom 'name' (ex: transaction.approved)
  if (event.name === 'transaction.approved' || event.name === 'transaction.created') {
    // Si c'est approved, le client a bien payé.
    if (event.name === 'transaction.approved') {
      const transaction = event.entity;
      // On récupère le custom_metadata qu'on avait envoyé
      const customMetadata = transaction.custom_metadata;
      
      if (customMetadata && customMetadata.user_id) {
        const userId = customMetadata.user_id;

        // On calcule une date de fin (1 mois plus tard)
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);

        await supabaseAdmin
          .from('subscriptions')
          .update({
            plan_type: 'pro',
            status: 'active',
            current_period_end: currentDate.toISOString(),
            stripe_subscription_id: `fedapay_${transaction.id}`, // On stocke l'ID fedapay
          })
          .eq('owner_id', userId);
      }
    }
  }

  return NextResponse.json({ received: true });
}
