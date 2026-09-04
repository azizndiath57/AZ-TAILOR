'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import { normalizePhone, generateSyntheticEmail } from '@/lib/phone'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const phone = formData.get('phone') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const workshopName = (formData.get('workshopName') as string).trim();

  if (password !== confirmPassword) {
    redirect(`/inscription?error=${encodeURIComponent("Les mots de passe ne correspondent pas.")}`);
  }

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone) {
    redirect(`/inscription?error=${encodeURIComponent("Le numéro de téléphone n'est pas valide.")}`);
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
    if (error.message.includes("User already registered") || error.status === 400) {
       redirect(`/inscription?error=${encodeURIComponent("Ce numéro de téléphone est déjà utilisé.")}`)
    }
    redirect(`/inscription?error=${encodeURIComponent(error.message)}`)
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
      // Rollback: the profile insertion failed (maybe phone unique constraint violated in profiles, though unlikely if auth succeeded, but could happen).
      // A full rollback would require a service role key. For now, we return a generic error.
      // The user will remain in auth.users, but without a profile.
      console.error("Profile creation error:", profileError);
      redirect(`/inscription?error=${encodeURIComponent("Erreur lors de la création du profil de l'atelier.")}`)
    }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
