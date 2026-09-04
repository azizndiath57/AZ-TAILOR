/**
 * Normalise un numéro de téléphone sénégalais.
 * Accepte les formats : "77 123 45 67", "771234567", "+221771234567", "00221771234567", avec espaces, points ou tirets.
 * Retourne le format E.164 : "+221771234567"
 * Retourne null si le numéro est invalide (longueur incorrecte ou préfixe mobile invalide).
 */
export function normalizePhone(input: string): string | null {
  if (!input) return null;

  // 1. Enlever tous les caractères non numériques
  let digits = input.replace(/\D/g, "");

  // 2. Traiter l'indicatif
  if (digits.startsWith("00221")) {
    digits = digits.substring(5);
  } else if (digits.startsWith("221") && digits.length === 12) { // 221 + 9 chiffres
    digits = digits.substring(3);
  }

  // 3. Vérifier la longueur (un numéro sénégalais local a 9 chiffres)
  if (digits.length !== 9) {
    return null;
  }

  // 4. Vérifier le préfixe mobile (70, 75, 76, 77, 78)
  const prefix = digits.substring(0, 2);
  const validPrefixes = ["70", "75", "76", "77", "78"];
  
  if (!validPrefixes.includes(prefix)) {
    return null;
  }

  // 5. Retourner au format E.164
  return `+221${digits}`;
}

/**
 * Génère un e-mail synthétique à partir d'un numéro normalisé.
 * Ex: +221771234567 -> 221771234567@phone.aztailors.internal
 */
export function generateSyntheticEmail(normalizedPhone: string): string {
  // On enlève le "+" pour avoir uniquement les chiffres
  const digitsOnly = normalizedPhone.replace("+", "");
  return `${digitsOnly}@phone.aztailors.internal`;
}
