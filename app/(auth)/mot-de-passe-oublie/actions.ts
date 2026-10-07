'use server'

import { createAdminClient } from '@/utils/supabase/admin'
import { normalizePhone } from '@/lib/phone'
import { isPasswordLengthValid, PASSWORD_LENGTH_ERROR } from '@/lib/constants/password'

// Même message que le numéro soit inconnu ou le code faux, pour ne pas révéler quels numéros ont un compte
const INVALID_CREDENTIALS = "Numéro ou code de récupération incorrect. Si vous n'avez pas de code, contactez le support."

export async function resetPassword(prevState: any, formData: FormData) {
  const phone = formData.get('phone') as string;
  const newPassword = formData.get('password') as string;
  const recoveryCode = formData.get('recoveryCode') as string;

  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone) {
    return { error: "Numéro de téléphone invalide." }
  }

  if (!isPasswordLengthValid(newPassword)) {
    return { error: PASSWORD_LENGTH_ERROR }
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
      return { error: INVALID_CREDENTIALS }
    }

    // 2. Count this attempt before checking the code: 5 per hour and per account at most,
    //    otherwise the 6-digit code can simply be brute-forced
    const { data: isAllowed, error: attemptError } = await adminSupabase
      .rpc('consume_password_reset_attempt', { p_user_id: profile.id });

    if (attemptError) {
      console.error("Erreur lors du comptage des tentatives:", attemptError.message);
      return { error: "Une erreur inattendue est survenue." }
    }

    if (!isAllowed) {
      return { error: "Trop de tentatives. Réessayez dans une heure." }
    }

    // 3. Fetch the user's data to check the recovery code
    const { data: userData, error: userError } = await adminSupabase.auth.admin.getUserById(profile.id);

    if (userError || !userData?.user) {
      return { error: "Erreur lors de la récupération de l'utilisateur." }
    }

    const expectedRecoveryCode = userData.user.user_metadata?.recovery_code;

    if (!expectedRecoveryCode || expectedRecoveryCode !== recoveryCode) {
      return { error: INVALID_CREDENTIALS }
    }

    // 4. Update the user's password using the Admin API
    const { error: updateError } = await adminSupabase.auth.admin.updateUserById(
      profile.id,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Erreur lors de la mise à jour du mot de passe:", updateError.message);
      return { error: "Une erreur est survenue lors de la réinitialisation du mot de passe." }
    }

    await adminSupabase.from('password_reset_attempts').delete().eq('user_id', profile.id);

    return { success: true }
  } catch (err: any) {
    console.error("Exception in resetPassword:", err.message);
    return { error: "Une erreur inattendue est survenue." }
  }
}
