'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { normalizePhone, generateSyntheticEmail } from '@/lib/phone'

export async function login(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    return { error: "Numéro de téléphone invalide." }
  }

  const email = generateSyntheticEmail(normalizedPhone);

  const data = {
    email,
    password,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    let errorMessage = error.message;
    if (errorMessage === "Invalid login credentials") {
      errorMessage = "Numéro ou mot de passe incorrect.";
    }
    return { error: errorMessage }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/connexion')
}
