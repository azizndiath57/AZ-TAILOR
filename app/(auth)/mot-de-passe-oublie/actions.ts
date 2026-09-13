'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { normalizePhone } from '@/lib/phone'

export async function resetPassword(prevState: any, formData: FormData) {
  const phone = formData.get('phone') as string;
  const newPassword = formData.get('password') as string;
  const recoveryCode = formData.get('recoveryCode') as string;
  
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    return { error: "Numéro de téléphone invalide." }
  }

  if (!newPassword || newPassword.length < 6) {
    return { error: "Le mot de passe doit contenir au moins 6 caractères." }
  }

  try {
    const adminSupabase = createAdminClient();

    // 1. Find the user ID by phone number in the profiles table
    const { data: profile, error: profileError } = await adminSupabase
      .from('profiles')
      .select('id')
      .eq('phone', normalizedPhone)
      .single();

    if (profileError || !profile) {
      return { error: "Aucun compte n'est associé à ce numéro." }
    }

    // 2. Fetch the user's data to check the recovery code
    const { data: userData, error: userError } = await adminSupabase.auth.admin.getUserById(profile.id);

    if (userError || !userData?.user) {
      return { error: "Erreur lors de la récupération de l'utilisateur." }
    }

    const expectedRecoveryCode = userData.user.user_metadata?.recovery_code;

    if (!expectedRecoveryCode) {
      return { error: "Aucun code de récupération n'est configuré pour ce compte. Veuillez contacter le support." }
    }

    if (expectedRecoveryCode !== recoveryCode) {
      return { error: "Code de récupération incorrect." }
    }

    // 3. Update the user's password using the Admin API
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
      profile.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Erreur lors de la mise à jour du mot de passe:", updateError.message);
      return { error: "Une erreur est survenue lors de la réinitialisation du mot de passe." }
    }

    return { success: true }
  } catch (err: any) {
    console.error("Exception in resetPassword:", err.message);
    return { error: "Une erreur inattendue est survenue." }
  }
}
