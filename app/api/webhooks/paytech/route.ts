import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { PRO_MONTHLY_PRICE_XOF } from '@/lib/constants/subscription';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function safeEqual(received: unknown, expected: string) {
  if (typeof received !== 'string') return false;
  const a = Buffer.from(received.toLowerCase());
  const b = Buffer.from(expected);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

// PayTech documente deux preuves d'authenticité pour un IPN : un HMAC de "montant|ref_command|api_key"
// (recommandé) et le SHA256 de chacune des clés API. L'une ou l'autre prouve que l'émetteur connaît nos clés.
function verifyPayTechSignature(body: Record<string, unknown>, apiKey: string, apiSecret: string): 'hmac' | 'sha256' | null {
  const expectedHmac = crypto
    .createHmac('sha256', apiSecret)
    .update(`${body.item_price}|${body.ref_command}|${apiKey}`)
    .digest('hex');
  if (safeEqual(body.hmac_compute, expectedHmac)) return 'hmac';

  const expectedKeyHash = crypto.createHash('sha256').update(apiKey).digest('hex');
  const expectedSecretHash = crypto.createHash('sha256').update(apiSecret).digest('hex');
  if (safeEqual(body.api_key_sha256, expectedKeyHash) && safeEqual(body.api_secret_sha256, expectedSecretHash)) return 'sha256';

  return null;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.PAYTECH_API_KEY;
    const apiSecret = process.env.PAYTECH_API_SECRET;

    // Sans les clés, rien n'est vérifiable : on refuse plutôt que de comparer avec le hash d'une chaîne vide
    if (!apiKey || !apiSecret) {
      console.error("IPN PayTech refusé : clés API PayTech absentes de la configuration.");
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    // PayTech envoie les données sous forme de formulaire (x-www-form-urlencoded) ou JSON
    // Pour être sûr, on utilise formData
    let body: Record<string, unknown> = {};
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      body = await req.json();
    } else {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        body[key] = value;
      });
    }

    const verifiedWith = verifyPayTechSignature(body, apiKey, apiSecret);
    if (!verifiedWith) {
      return NextResponse.json({ error: "Invalid signatures" }, { status: 401 });
    }

    const { type_event, ref_command } = body;

    if (type_event === 'sale_complete' && typeof ref_command === 'string') {
      // ref_command is in format: timestamp__userid
      const customUserId = ref_command.split('__')[1];

      if (!customUserId || !UUID_PATTERN.test(customUserId)) {
        console.error("IPN PayTech ignoré : référence de commande sans identifiant d'atelier valide.", ref_command);
        return NextResponse.json({ received: true, ignored: "reference" });
      }

      // Le prix avant une éventuelle promotion PayTech doit être celui de la formule Pro
      const paidAmount = Number(body.initial_item_price ?? body.item_price);
      if (!(paidAmount >= PRO_MONTHLY_PRICE_XOF)) {
        console.error(`IPN PayTech ignoré : montant ${body.item_price} inférieur au prix de la formule Pro.`, ref_command);
        return NextResponse.json({ received: true, ignored: "amount" });
      }

      // PayTech peut envoyer plusieurs fois la même notification : un paiement n'ouvre qu'un seul mois
      const paymentReference = `paytech_${ref_command}`;
      const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('stripe_subscription_id')
        .eq('owner_id', customUserId)
        .maybeSingle();

      if (subscription?.stripe_subscription_id === paymentReference) {
        return NextResponse.json({ received: true, ignored: "duplicate" });
      }

      // On calcule une date de fin (1 mois plus tard)
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + 1);

      const { data: updated, error: updateError } = await supabaseAdmin
        .from('subscriptions')
        .update({
          plan_type: 'pro',
          status: 'active',
          current_period_end: currentDate.toISOString(),
          stripe_subscription_id: paymentReference,
        })
        .eq('owner_id', customUserId)
        .select('owner_id');

      if (updateError || !updated?.length) {
        console.error("IPN PayTech : paiement valide mais abonnement non mis à jour.", ref_command, updateError?.message);
        return NextResponse.json({ error: "Subscription not updated" }, { status: 500 });
      }

      console.log(`IPN PayTech accepté (vérification ${verifiedWith}) : formule Pro activée.`, ref_command);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erreur IPN PayTech:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
