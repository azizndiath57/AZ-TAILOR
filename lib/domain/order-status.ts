export type OrderStatus = "en_attente" | "en_cours" | "pret" | "livre" | "annule";

const STATUS_RANK: Record<OrderStatus, number> = {
  en_attente: 0,
  en_cours: 1,
  pret: 2,
  livre: 3,
  annule: -1
};

export function isStatusTransitionAllowed(currentStatus: OrderStatus, newStatus: OrderStatus): boolean {
  if (currentStatus === newStatus) return true;
  
  // Terminal states cannot be changed
  if (currentStatus === "livre" || currentStatus === "annule") return false;

  // Can cancel from any non-terminal state
  if (newStatus === "annule") return true;

  // Normal flow: strictly increasing rank
  return STATUS_RANK[newStatus] > STATUS_RANK[currentStatus];
}

export function getAllowedNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
  const allStatuses: OrderStatus[] = ["en_attente", "en_cours", "pret", "livre", "annule"];
  return allStatuses.filter(status => isStatusTransitionAllowed(currentStatus, status));
}
