export const PAYMENT_METHODS = [
  { id: "cash", label: "Cash" },
  { id: "wave", label: "Wave" },
  { id: "orange_money", label: "Orange Money" },
  { id: "virement", label: "Virement" },
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number]["id"];

// Les valeurs venant d'un formulaire ou de la base sont de simples chaînes : on retombe sur "cash" si elles sont inconnues
export function toPaymentMethod(value: unknown): PaymentMethod {
  const match = PAYMENT_METHODS.find((method) => method.id === value);
  return match ? match.id : "cash";
}
