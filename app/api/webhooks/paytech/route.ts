import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    // PayTech envoie les données sous forme de formulaire (x-www-form-urlencoded) ou JSON
    // Pour être sûr, on utilise formData
    let body: any = {};
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        body[key] = value;
      });
    }

    const { type_event, custom_field, ref_command, api_key_sha256, api_secret_sha256 } = body;

    // Vérification de sécurité avec les SHA256 des clés API (selon la documentation PayTech)
    const myApiKeySha256 = crypto.createHash('sha256').update(process.env.PAYTECH_API_KEY || '').digest('hex');
    const myApiSecretSha256 = crypto.createHash('sha256').update(process.env.PAYTECH_API_SECRET || '').digest('hex');

    if (api_key_sha256 !== myApiKeySha256 || api_secret_sha256 !== myApiSecretSha256) {
      return NextResponse.json({ error: "Invalid signatures" }, { status: 401 });
    }

    if (type_event === 'sale_complete' && custom_field) {
      let customData = typeof custom_field === 'string' ? JSON.parse(custom_field) : custom_field;
      const customUserId = customData.custom_user_id;

      if (customUserId) {
        // On calcule une date de fin (1 mois plus tard)
        const currentDate = new Date();
        currentDate.setMonth(currentDate.getMonth() + 1);

        await supabaseAdmin
          .from('subscriptions')
          .update({
            plan_type: 'pro',
            status: 'active',
            current_period_end: currentDate.toISOString(),
            stripe_subscription_id: `paytech_${ref_command}`, 
          })
          .eq('owner_id', customUserId);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur IPN PayTech:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
