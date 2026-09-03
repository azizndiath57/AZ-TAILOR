'use server';

import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { FedaPay, Transaction } from 'fedapay';

export async function createFedaPayCheckoutSession() {
  const supabase = createClient();
  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  if (!user) {
    throw new Error('Vous devez être connecté pour vous abonner.');
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const FEDAPAY_SECRET_KEY = process.env.FEDAPAY_SECRET_KEY;

  if (!FEDAPAY_SECRET_KEY) {
    throw new Error('La clé API FedaPay n\'est pas configurée.');
  }

  // Configuration de FedaPay (environnement "sandbox" pour tester, "live" en prod)
  FedaPay.setApiKey(FEDAPAY_SECRET_KEY);
  
  // Par défaut, l'environnement est sandbox. Si la clé commence par sk_live, c'est en prod.
  if (FEDAPAY_SECRET_KEY.startsWith('sk_live')) {
    FedaPay.setEnvironment('live');
  } else {
    FedaPay.setEnvironment('sandbox');
  }

  let transaction;

  try {
    // Création de la transaction
    transaction = await Transaction.create({
      description: 'Abonnement AZ-TAILOR Pro',
      amount: 5000,
      currency: { iso: 'XOF' },
      callback_url: `${baseUrl}/settings?success=true`,
      customer: {
        email: user.email || 'client@aztailor.com',
        firstname: 'Abonné',
        lastname: 'AZ-TAILOR'
      },
      custom_metadata: {
        user_id: user.id
      }
    });

    // Génération du lien de paiement
    const token = await transaction.generateToken();
    const url = token.url;
    
    if (!url) {
      throw new Error('Pas d\'URL de paiement générée');
    }
    
    // Redirection vers la page sécurisée FedaPay
    redirect(url);

  } catch (error: any) {
    console.error('Erreur FedaPay:', error);
    
    // Si c'est une erreur Next (comme la redirection), on la laisse passer
    if (error.message === 'NEXT_REDIRECT') {
      throw error; 
    }
    
    throw new Error('Erreur lors de la création de la session FedaPay.');
  }
}
