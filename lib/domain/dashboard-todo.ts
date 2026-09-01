import { addDays, isBefore, isSameDay, startOfDay } from "date-fns";

export type DueDateStatus = "en_retard" | "proche" | "normal";

export function classifyDueDate(expectedDeliveryDate: Date, today: Date = new Date()): DueDateStatus {
  const startOfExpected = startOfDay(expectedDeliveryDate);
  const startOfToday = startOfDay(today);
  
  if (isBefore(startOfExpected, startOfToday)) {
    return "en_retard";
  }
  
  // Proche = aujourd'hui ou dans les 3 prochains jours
  const limitDate = addDays(startOfToday, 3);
  if (isBefore(startOfExpected, limitDate) || isSameDay(startOfExpected, limitDate)) {
    return "proche";
  }
  
  return "normal";
}
