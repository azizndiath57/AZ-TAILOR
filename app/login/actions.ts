'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

import { headers } from 'next/headers'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  if (password !== confirmPassword) {
    redirect(`/login?mode=signup&error=${encodeURIComponent("Les mots de passe ne correspondent pas.")}`);
  }

  // Get the origin from headers to construct the callback URL
  const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const data = {
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        first_name: firstName,
        last_name: lastName,
      }
    }
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect(`/login?mode=signup&error=${encodeURIComponent(error.message)}`)
  }

  if (authData.user && !authData.session) {
    redirect(`/login?mode=signup&success=${encodeURIComponent("Inscription réussie ! Veuillez vérifier vos emails pour confirmer votre compte (ou désactivez la confirmation d'email dans Supabase).")}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export async function signInWithGoogle() {
  const supabase = await createClient()
  const origin = (await headers()).get('origin') || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  if (data.url) {
    redirect(data.url)
  }
}
