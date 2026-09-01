export const PAYMENT_METHODS = [
  { id: "cash", label: "Cash" },
  { id: "wave", label: "Wave" },
  { id: "orange_money", label: "Orange Money" },
  { id: "virement", label: "Virement" },
] as const;

export type PaymentMethod = typeof PAYMENT_METHODS[number]["id"];
