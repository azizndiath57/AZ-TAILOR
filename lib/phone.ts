/**
 * Normalise un numéro de téléphone sénégalais.
 * Accepte les formats : "77 123 45 67", "771234567", "+221771234567", "00221771234567", avec espaces, points ou tirets.
 * Retourne le format E.164 : "+221771234567"
 * Retourne null si le numéro est invalide (longueur incorrecte ou préfixe mobile invalide).
 */
export function normalizePhone(input: string): string | null {
  if (!input) return null;

  // 1. Nettoyer les espaces, tirets, points
  let cleaned = input.replace(/[\s\-\.]/g, "");

  // 2. Remplacer '00' initial par '+'
  if (cleaned.startsWith("00")) {
    cleaned = "+" + cleaned.substring(2);
  }

  let digits = cleaned.replace(/\D/g, "");

  // 3. Si aucun '+' n'a été fourni
  if (!cleaned.startsWith("+")) {
    // Cas spécial Sénégal : 9 chiffres sans indicatif
    if (digits.length === 9) {
      const prefix = digits.substring(0, 2);
      if (["70", "75", "76", "77", "78"].includes(prefix)) {
        return `+221${digits}`;
      }
    }
    
    // S'ils ont tapé directement avec l'indicatif sans le '+' (ex: 22501020304)
    if (digits.length >= 10 && digits.length <= 15) {
      return `+${digits}`;
    }
  } else {
    // Il y a un '+'
    if (digits.length >= 10 && digits.length <= 15) {
      return `+${digits}`;
    }
  }

  return null;
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
