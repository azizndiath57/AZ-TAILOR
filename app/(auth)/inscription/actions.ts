'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { normalizePhone, generateSyntheticEmail } from '@/lib/phone'

export async function signup(prevState: any, formData: FormData) {
  const supabase = await createClient()

  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const workshopName = (formData.get('workshopName') as string).trim();

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    return { error: "Le numéro de téléphone n'est pas valide." };
  }

  const email = generateSyntheticEmail(normalizedPhone);

  // 1. Check if the synthetic email already exists implicitly by trying to sign up
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        workshop_name: workshopName
      }
    }
  })

  if (error) {
    // Handling specific error for existing user
    if (error.message?.includes("User already registered") || error.status === 400) {
       return { error: "Ce numéro de téléphone est déjà utilisé." };
    }
    return { error: error.message };
  }

  // 2. Insert into the new profiles table
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        phone: normalizedPhone,
        nom_atelier: workshopName
      });

    if (profileError) {
      console.error("Profile creation error:", profileError);
      return { error: "Erreur lors de la création du profil de l'atelier." };
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
