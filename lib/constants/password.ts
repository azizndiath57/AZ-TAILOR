// 72 est le maximum accepté par Supabase Auth (limite de bcrypt)
export const PASSWORD_MIN_LENGTH = 6;
export const PASSWORD_MAX_LENGTH = 72;

export const PASSWORD_LENGTH_ERROR = `Le mot de passe doit contenir entre ${PASSWORD_MIN_LENGTH} et ${PASSWORD_MAX_LENGTH} caractères.`;

export function isPasswordLengthValid(password: string | null | undefined): password is string {
  return !!password && password.length >= PASSWORD_MIN_LENGTH && password.length <= PASSWORD_MAX_LENGTH;
}
