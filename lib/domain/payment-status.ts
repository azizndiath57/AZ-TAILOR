export type PaymentStatus = "non_paye" | "partiel" | "paye";

export function computeTotalPaid(payments: { amount: number }[]): number {
  return payments.reduce((sum, p) => sum + p.amount, 0);
}

export function computeBalanceDue(totalPrice: number, totalPaid: number): number {
  return Math.max(0, totalPrice - totalPaid);
}

export function computePaymentStatus(totalPrice: number, totalPaid: number): PaymentStatus {
  if (totalPaid === 0) return "non_paye";
  if (totalPaid >= totalPrice) return "paye";
  return "partiel";
}

export function canRecordPayment(totalPrice: number, totalPaid: number, amountToRecord: number): boolean {
  if (amountToRecord <= 0) return false;
  return (totalPaid + amountToRecord) <= totalPrice;
}
